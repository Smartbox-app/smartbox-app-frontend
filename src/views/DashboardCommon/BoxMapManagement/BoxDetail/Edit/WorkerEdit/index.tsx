import { ItfApiForm } from 'itf_formbuilder_react';
import React from 'react';
import { connect, useDispatch } from 'react-redux';
import ReactCreatableSelect from 'react-select/creatable';
import { bindActionCreators } from 'redux';
import { BoxListItem, ChangeStatusReq, RentStatus, StockList } from 'smartbox-types';
import { boxes, modal, notifications } from '../../../../../../actions';
import { Alert } from '../../../../../../components/Common';
import { Button, Spinner } from '../../../../../../components/Branded';
import { ButtonsContainer, FormContainer } from '../../../../../../components/Layout';
import { __ } from '../../../../../../helpers/i18n';
import { ApplicationState } from '../../../../../../reducers';
import ApiService from '../../../../../../services/api-service';
import { formOnTranslateString } from '../../../../../../utils/trans-form';
import { ReactSelectOverride } from '../../../../../../components/Common/ReactSelectOverride';
import { refreshApiTableData } from '../../../../../../actions/api-table';

interface Props {
  rentId: string;
  selectedBoxId: string;
  boxesGroup: BoxListItem[] | null;
  hideModal: () => void;
  successNotification: (text: string) => void;
  showModal: (content: React.ReactNode) => void;
  callback?: () => void;
}

const WorkerEdit = ({
  hideModal,
  successNotification,
  rentId,
  boxesGroup,
  selectedBoxId,
  showModal,
  callback
}: Props) => {
  const dispatch = useDispatch();
  const submitButton = (
    <ButtonsContainer>
      <Button text="application.changeStatus" type="submit" danger />
    </ButtonsContainer>
  );

  const fetchUrl = 'rent/form/change-status-after-checked';
  const sendUrl = `rent/status-after-checked/${rentId}`;

  const customSendFetcher = (formId: string, values: ChangeStatusReq) => {
    showModal(
      <>
        <Alert type="primary" text="application.userWillNotGetMailWithInformation" />
        <Alert type="primary" text="application.actionCanNotBeUnDone" />
        <ButtonsContainer max>
          <Button text="application.cancel" danger click={() => hideModal()} />
          <Button
            success
            type="submit"
            text="application.understood"
            click={async () => {
              hideModal();
              await ApiService.sendForm(
                sendUrl,
                {
                  ...values,
                },
                'PATCH',
              );
              successNotification('notification.userStatusChanged');
              dispatch(refreshApiTableData());
              if(callback) callback();
            }}
          />
        </ButtonsContainer>
      </>,
    );
  };

  const canWorkerEdit = (): boolean => {
    let result = true;
    boxesGroup?.forEach((box: BoxListItem) => {
      if (box.number === `${selectedBoxId}` && box.status === RentStatus.toCheck) {
        result = false;
      }
    });
    return result;
  };

  if (rentId === '' || canWorkerEdit()) {
    return <p>{__('application.youCanNotEditStore')}</p>;
  }

  return (
    <FormContainer className="box-status-form">
      <ItfApiForm
        formId="box-status-form-worker"
        schemaMayBeDynamic={false}
        schemaCacheEnabled={false}
        schemaFetcher={() => ApiService.loadForm(fetchUrl)}
        sendFetcher={customSendFetcher}
        submitButton={submitButton}
        loadingInfo={<Spinner transparent />}
        onErrorsWhileSaving={() => hideModal()}
        onTranslateString={formOnTranslateString}
        thirdPartyComponents={{ ReactSelect: ReactSelectOverride, ReactCreatableSelect }}
      />
    </FormContainer>
  );
};

const mapStateToProps = (state: ApplicationState) => ({
  stockId: state.rent.stockId,
  stock: state.stock.list[0],
  boxesGroup: state.boxes.boxesGroup,
});

const mapDispatchToProps = (dispatch: any) => bindActionCreators({ ...boxes, ...modal, ...notifications }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(WorkerEdit);
