import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';

import { hideModal } from 'src/actions/modal';
import { successNotification } from 'src/actions/notifications';
import { Button } from 'src/components/Branded';
import { InputPhone, InputSelect } from 'src/components/Common';
import { ButtonsContainer } from 'src/components/Layout';
import { Form, Input, Modal } from 'src/components/ui';
import { AddRentAuthorizedUserFormDto } from 'src/dto/AddRentAuthorizedUserFormDto';
import { __ } from 'src/helpers/i18n';
import { useAddRentAuthorizedUserMutation } from 'src/mutations';
import { ClassValidatorResolver } from 'src/resolvers/ClassValidatorResolver';
import type { TranslatableObject } from 'src/utils/errors-trans';

const defaultFormValues: AddRentAuthorizedUserFormDto = {
  lookupMode: 'email',
  contact: '',
};

type Props = {
  rentId: string;
};

export const AddRentAuthorizationModal = ({ rentId }: Props) => {
  const dispatch = useDispatch();
  const {
    mutate: addRentAuthorization,
    isPending,
    isSuccess,
  } = useAddRentAuthorizedUserMutation();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    control,
    resetField,
    formState: { errors },
  } = useForm<AddRentAuthorizedUserFormDto>({
    mode: 'onSubmit',
    resolver: ClassValidatorResolver(new AddRentAuthorizedUserFormDto()),
    defaultValues: defaultFormValues,
  });

  const lookupMode = watch('lookupMode');

  useEffect(() => {
    resetField('contact', { defaultValue: '' });
  }, [lookupMode, resetField]);

  const contactPhoneErrors = (message: string): TranslatableObject[] => [
    {
      messageWithPlaceholders: message,
      messageCompiled: message,
      params: [],
    },
  ];

  const lookupOptions = [
    {
      value: 'email',
      label: __('application.rentAuthorizationsModeEmail'),
    },
    {
      value: 'phone',
      label: __('application.rentAuthorizationsModePhone'),
    },
  ];

  useEffect(() => {
    if (!isSuccess) return;

    reset();
    dispatch(hideModal());
    dispatch(successNotification(__('application.rentAuthorizationsAdded')));
  }, [isSuccess, reset, dispatch]);

  const onSubmit = (data: AddRentAuthorizedUserFormDto) => {
    const body =
      data.lookupMode === 'email'
        ? { email: data.contact.toLowerCase() }
        : { phone: data.contact };

    addRentAuthorization({ rentId, body });
  };

  const handleCancel = () => {
    dispatch(hideModal());
  };

  return (
    <>
      <Modal.Header title={__('application.rentAuthorizationsAdd')} />
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Content>
          <p>{__('application.rentAuthorizationsDescription')}</p>
        <Controller
          name="lookupMode"
          control={control}
          render={({ field, fieldState }) => (
            <InputSelect
              name="lookupMode"
              label="application.rentAuthorizationsLookupBy"
              options={lookupOptions}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              error={fieldState.error?.message}
              disabled={isPending}
            />
          )}
        />

        {lookupMode === 'email' ? (
          <Input
            {...register('contact')}
            label="application.rentAuthorizationsEmail"
            type="email"
            placeholder="application.rentAuthorizationsEmailPlaceholder"
            error={errors.contact?.message}
            disabled={isPending}
          />
        ) : (
          <Controller
            name="contact"
            control={control}
            render={({ field, fieldState }) => (
              <InputPhone
                name="contact"
                label="application.rentAuthorizationsPhone"
                value={field.value ?? ''}
                onChange={(v) => field.onChange(v ?? '')}
                disabled={isPending}
                errors={
                  fieldState.error?.message
                    ? contactPhoneErrors(fieldState.error.message)
                    : undefined
                }
              />
            )}
          />
        )}

        </Modal.Content>
        <Modal.Actions>
          <ButtonsContainer>
            <Button
              text="application.cancel"
              success
              click={handleCancel}
              disabled={isPending}
            />
            <Button
              text="application.save"
              primary
              type="submit"
              disabled={isPending}
            />
          </ButtonsContainer>
        </Modal.Actions>
      </Form>
    </>
  );
};
