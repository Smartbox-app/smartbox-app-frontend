import { useDispatch } from 'react-redux';
import { BoxGroupUserRes } from 'smartbox-types';
import { modal } from 'src/actions';
import { NotifyWhenAvailableModal } from 'src/components/Common';
import { Button } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';
import { useTenant } from 'src/hooks/useTenant';
import { Calendar } from 'src/icons';

export type OptionNotificationProps = {
  option: BoxGroupUserRes;
};

export const OptionNotification = ({ option }: OptionNotificationProps) => {
  const { tenant } = useTenant();
  const dispatch = useDispatch();

  const onClick = () => {
    dispatch(modal.showModal(<NotifyWhenAvailableModal option={option} />));
  };

  if (option.available || !tenant) return null;

  return (
    <Button
      size="medium"
      fullWidth
      type="button"
      text={__('application.notify_when_available')}
      onClick={onClick}
      iconLeft={<Calendar />}
    />
  );
};
