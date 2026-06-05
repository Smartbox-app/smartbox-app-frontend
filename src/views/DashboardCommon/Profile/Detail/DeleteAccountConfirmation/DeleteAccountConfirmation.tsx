import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { hideModal } from 'src/actions/modal';
import { ButtonsContainer } from 'src/components/Layout';
import { Button, Form, Input, Modal, Typography } from 'src/components/ui';
import { DeleteAccountDto } from 'src/dto/DeleteAccountDto';
import { __ } from 'src/helpers/i18n';
import { useTenant } from 'src/hooks/useTenant';
import { useLogoutMutation } from 'src/mutations';
import { useDeleteAccountMutation } from 'src/mutations/useDeleteAccountMutation/useDeleteAccountMutation';
import { useGetMyDetailsQuery } from 'src/queries';
import { ClassValidatorResolver } from 'src/resolvers/ClassValidatorResolver';

export const DeleteAccountConfirmation = () => {
  const dispatch = useDispatch();
  const { tenant } = useTenant();
  const { data: user } = useGetMyDetailsQuery();
  const {
    mutate: deleteUser,
    isPending,
    isSuccess,
  } = useDeleteAccountMutation(user?.id || '');
  const { mutate: logout } = useLogoutMutation();

  const {
    handleSubmit,
    register,
    watch,
    formState: { errors, isValid },
  } = useForm<DeleteAccountDto>({
    mode: 'onSubmit',
    resolver: ClassValidatorResolver(new DeleteAccountDto()),
  });

  const identifier = watch('identifier');

  useEffect(() => {
    if (!isSuccess) return;

    dispatch(hideModal());
    logout();
  }, [isSuccess]);

  const onSubmit = () => {
    if (identifier !== tenant?.identifier) return;

    deleteUser();
  };

  return (
    <>
      <Modal.Header title={__('application.deleteAccount')} />
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Content>
          <Typography>{__('application.deleteAccountInfo')}</Typography>
          <Typography>
            {__('application.deleteAccountConfirmation')}{' '}
            <strong>{tenant?.identifier}</strong>
          </Typography>

          <Input
            label=""
            error={errors['identifier']?.message}
            {...register('identifier')}
          />
        </Modal.Content>
        <Modal.Actions>
          <ButtonsContainer>
            <Button
              text="application.deleteAccount"
              type="submit"
              disabled={identifier !== tenant?.identifier}
            />
          </ButtonsContainer>
        </Modal.Actions>
      </Form>
    </>
  );
};
