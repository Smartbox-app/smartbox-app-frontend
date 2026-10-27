import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';

import { hideModal } from 'src/actions/modal';
import { Button } from 'src/components/Branded';
import { ButtonsContainer } from 'src/components/Layout';
import { Input, Modal } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';
import { useTenantNaming } from 'src/hooks/useTenantNaming';

interface Props {
  mainText: string;
  cancelButtonText?: string;
  approveButtonText: string;
  approveAction: (stockName: string) => void;
}

export const DeleteStockModal = ({
  mainText,
  cancelButtonText = 'application.cancel',
  approveButtonText,
  approveAction,
}: Props) => {
  const dispatch = useDispatch();
  const { getText } = useTenantNaming();
  const { register, getValues } = useForm<{ stockName: string }>();
  return (
    <>
      <Modal.Header title={__('application.confirmation')} />
      <Modal.Content>
        <p>{__(mainText)}</p>
        <Input {...register('stockName')} label={getText('name_of')} />
      </Modal.Content>
      <Modal.Actions>
        <ButtonsContainer>
          <Button
            click={() => dispatch(hideModal())}
            text={cancelButtonText}
            success
          />
          <Button
            danger
            click={() => {
              approveAction(getValues('stockName') || '');
              dispatch(hideModal());
            }}
            text={approveButtonText}
          />
        </ButtonsContainer>
      </Modal.Actions>
    </>
  );
};
