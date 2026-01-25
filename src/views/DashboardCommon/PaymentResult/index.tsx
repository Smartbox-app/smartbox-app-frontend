import { PaymentStatus } from 'smartbox-types';

import { __ } from '../../../helpers/i18n';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { showModal } from 'src/actions/modal';
import { PaymentModal } from './PaymentModal';
import { history } from 'src/App';
import { useParams } from 'react-router';

interface Props {
  status?: PaymentStatus;
}

export const PaymentResult = ({ status }: Props) => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(showModal(<PaymentModal status={status} id={id} />));
    history.push('/');
  }, [status]);

  return null;
};
