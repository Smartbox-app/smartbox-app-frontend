import { useDispatch } from 'react-redux';
import { Button } from '../../Branded';
import { __ } from '../../../helpers/i18n';
import { hideModal } from 'src/actions/modal';
import { Input, Modal } from 'src/components/ui';
import { useForm } from 'react-hook-form';

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
  const { register, getValues } = useForm<{ stockName: string }>();
  return (
    <>
      <Modal.Header title={__('application.confirmation')} />
      <Modal.Content>
        <p>{__(mainText)}</p>
        <Input {...register('stockName')} label="Nazwa placu" />
      </Modal.Content>
      <Modal.Actions>
        <Button click={() => dispatch(hideModal())} text={cancelButtonText} success />
        <Button
          danger
          click={() => {
            approveAction(getValues('stockName') || '');
            dispatch(hideModal());
          }}
          text={approveButtonText}
        />
      </Modal.Actions>
    </>
  );
};
