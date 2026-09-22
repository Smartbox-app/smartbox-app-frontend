import { useDispatch } from 'react-redux';
import { BoxGroupUserRes } from 'smartbox-types';
import { modal } from 'src/actions';
import { NotifyWhenAvailableModal } from 'src/components/Common';
import { Button } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';
import { useTenant } from 'src/hooks/useTenant';
import {
  Calendar,
  ArrowRightCircle,
} from 'src/icons';
import styled from 'styled-components';

export type OptionActionsProps = {
  option: BoxGroupUserRes;
  onSelectOption: () => void;
};

export const OptionActions = ({ option, onSelectOption }: OptionActionsProps) => {
  const { tenant } = useTenant();
  const dispatch = useDispatch();

  const onClick = () => {
    dispatch(modal.showModal(<NotifyWhenAvailableModal option={option} />));
  };

  const onSelectClick = () => {
    onSelectOption();
  };

  if (!tenant) return null;

  return (
    <>
      {!option.available ? (
        <Button
          size="medium"
          type="button"
          text={__('application.notify_when_available')}
          // text='Powiadom mnie'
          onClick={onClick}
          iconLeft={<Calendar />}
        />
      ) : (
        <Button
          size="medium"
          type="button"
          text={__('application.choose_this')}
          // text='Powiadom mnie'
          onClick={onSelectClick}
          iconLeft={<ArrowRightCircle />}
        />
      )}
    </>
  );
};
