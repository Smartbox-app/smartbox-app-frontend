import React from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { BoxGroupUserRes } from 'smartbox-types';
import { Button, CheckBox, Form, Modal, Typography } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';
import { NotificationDto } from './dto/NotificationDto';
import { ClassValidatorResolver } from 'src/resolvers/ClassValidatorResolver';
import { useDispatch } from 'react-redux';
import { modal, notifications } from 'src/actions';
import { ErrorText } from 'src/components/ui/ErrorText';
import styled from 'styled-components';
import { useCreateNotificationMutation } from './query/useCreateNotificationMutation';
import { useTenant } from 'src/hooks/useTenant';
import { Spinner } from 'src/components/Branded';
import { useEffect } from 'react';

const StyledContent = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing * 2,
}));

export type NotifyWhenAvailableModalProps = {
  option: BoxGroupUserRes;
};

export const NotifyWhenAvailableModal = ({
  option,
}: NotifyWhenAvailableModalProps) => {
  const { tenant } = useTenant();
  const dispatch = useDispatch();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<NotificationDto>({
    mode: 'onSubmit',
    resolver: ClassValidatorResolver(new NotificationDto()),
  });

  const { mutate, isPending, data, error } = useCreateNotificationMutation();

  const onSubmit: SubmitHandler<NotificationDto> = (data) => {
    if (!tenant) return;
    mutate({
      email: data.email,
      sms: data.sms || false,
      boxGroupId: option.id,
      tenantId: tenant.id,
    });
  };

  useEffect(() => {
    if (!data) return;

    dispatch(
      notifications.successNotification('notification.youWillBeNotified'),
    );
    dispatch(modal.hideModal());
  }, [data]);

  const onClose = () => {
    dispatch(modal.hideModal());
  };
  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Modal.Header title={__('application.notificationsAboutBoxes')} />
      <Modal.Content>
          {isPending ? <Spinner overlay halfTransparent /> : null}
          <StyledContent>
            <Typography>
              {__('application.notification_for')}
              <strong>{option.name}</strong>
            </Typography>
            <Typography>{__('application.notification_type')}</Typography>

            <CheckBox
              {...register('email')}
              label={<Typography>{__('application.email')}</Typography>}
            />

            {tenant?.smsAvailable ? (
              <CheckBox
                {...register('sms')}
                label={<Typography>{__('application.sms')}</Typography>}
              />
            ) : null}
            {errors.atLeastOne?.message ? (
              <ErrorText error={errors.atLeastOne.message} />
            ) : null}
          </StyledContent>
        </Modal.Content>
        <Modal.Actions>
          <Button
            variant="secondary"
            text={__('application.cancel')}
            onClick={onClose}
            type="button"
          />
          <Button
            disabled={isPending}
            variant="primary"
            text={__('application.save')}
            type="submit"
          />
      </Modal.Actions>
    </Form>
  );
};
