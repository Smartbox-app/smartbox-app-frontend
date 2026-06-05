import { useDispatch } from 'react-redux';
import { useParams } from 'react-router';
import { FieldType, lockPasscodesList } from 'smartbox-tables';
import { TTLockPasscode } from 'smartbox-types';
import { refreshApiTableData } from 'src/actions/api-table';
import { showModal } from 'src/actions/modal';
import { successNotification } from 'src/actions/notifications';
import { ApiTable, ConfirmModal } from 'src/components/Common';
import { ButtonsContainer } from 'src/components/Layout';
import { Button, HeaderWithActions, Section } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';
import ApiService from 'src/services/api-service';
import { InteractiveTableSchema } from 'src/utils/table-schema-utils';

export const List = () => {
  const dispatch = useDispatch();

  const { lockId } = useParams<{ lockId?: string }>();

  const scheme = new InteractiveTableSchema(lockPasscodesList).addFieldAtTheEnd(
    {
      name: __('application.actions'),
      field: 'actions',
      type: FieldType.Custom,
      mobile: true,
      customRender: (value, field, passcode: TTLockPasscode) => (
        <ButtonsContainer noWrap>
          <Button
            variant="error"
            text="application.delete"
            onClick={() => confirmPasscodeDelete(passcode.keyboardPwdId)}
          />
        </ButtonsContainer>
      ),
    },
  );

  const confirmPasscodeDelete = (id: string) => {
    dispatch(
      showModal(
        <ConfirmModal
          mainText={__('application.confirmPasscodeDelete')}
          approveButtonText="application.yes"
          approveAction={() => deletePasscode(id)}
        />,
      ),
    );
  };

  const deletePasscode = async (id: string) => {
    await ApiService.callFetch(
      'DELETE',
      `driver/locks/${lockId}/passcodes/${id}`,
      () => {
        dispatch(successNotification(__('application.passcodeDeleted')));
        dispatch(refreshApiTableData());
      },
    );
  };

  if (!lockId) return null;

  return (
    <Section>
      <HeaderWithActions
        actions={
          <ButtonsContainer>
            <Button
              variant="primary"
              text="application.addLockPasscode"
              to={`/admin/drivers/locks/${lockId}/passcodes/add`}
            />
          </ButtonsContainer>
        }
      >
        {__('application.lockPasscodes')}
      </HeaderWithActions>
      <ApiTable
        scheme={scheme}
        apiEndpointSubUrl={`driver/locks/${lockId}/passcodes`}
      />
    </Section>
  );
};
