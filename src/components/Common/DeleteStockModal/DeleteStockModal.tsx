import { useDispatch } from 'react-redux';
import { ButtonsContainer } from '../../Layout';
import { Button } from '../../Branded';

import './DeleteStockModal.scss';
import { __ } from '../../../helpers/i18n';
import { hideModal } from 'src/actions/modal';
import { Input } from 'src/components/ui';
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
    <div className="confirm-modal-wrapper">
      <p>{mainText}</p>
      <Input {...register('stockName')} label='Nazwa placu' />
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
    </div>
  );
};
