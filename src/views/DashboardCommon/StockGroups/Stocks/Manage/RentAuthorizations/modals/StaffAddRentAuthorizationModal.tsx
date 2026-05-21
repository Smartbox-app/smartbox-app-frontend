import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';
import { Button } from 'src/components/Branded';
import { InputPhone } from 'src/components/Common';
import {
  ButtonsContainer,
  FormContainer,
  SectionHeader,
} from 'src/components/Layout';
import { Form, Input, Select } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';
import { successNotification } from 'src/actions/notifications';
import { hideModal } from 'src/actions/modal';
import { refreshApiTableData } from 'src/actions/api-table';
import { RENT_AUTHORIZATIONS_MODAL } from 'src/constants/api-table-instances';
import { useStaffCreateRentAuthorizationMutation } from 'src/mutations';
import { StaffAddRentAuthorizationFormDto } from 'src/dto/StaffAddRentAuthorizationFormDto';
import { ClassValidatorResolver } from 'src/resolvers/ClassValidatorResolver';
import type { TranslatableObject } from 'src/utils/errors-trans';

const defaultFormValues: StaffAddRentAuthorizationFormDto = {
  rentId: '',
  lookupMode: 'email',
  contact: '',
};

type Props = {
  stockId: string;
  rentId: string;
};

export const StaffAddRentAuthorizationModal = ({ stockId, rentId }: Props) => {
  const dispatch = useDispatch();
  const {
    mutate: createAuthorization,
    isPending,
    isSuccess,
  } = useStaffCreateRentAuthorizationMutation();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    resetField,
    control,
    formState: { errors },
  } = useForm<StaffAddRentAuthorizationFormDto>({
    mode: 'onSubmit',
    resolver: ClassValidatorResolver(new StaffAddRentAuthorizationFormDto()),
    defaultValues: {
      ...defaultFormValues,
      rentId,
    },
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
    dispatch(refreshApiTableData(RENT_AUTHORIZATIONS_MODAL));
  }, [isSuccess, reset, dispatch, RENT_AUTHORIZATIONS_MODAL]);

  const onSubmit = (data: StaffAddRentAuthorizationFormDto) => {
    const body =
      data.lookupMode === 'email'
        ? {
            rentId: data.rentId.trim(),
            email: data.contact.trim().toLowerCase(),
          }
        : { rentId: data.rentId.trim(), phone: data.contact.trim() };

    createAuthorization(body);
  };

  const handleCancel = () => {
    dispatch(hideModal());
  };

  return (
    <FormContainer>
      <SectionHeader title="application.rentAuthorizationsAdd" />
      <p>{__('application.rentAuthorizationsDescription')}</p>

      <Form onSubmit={handleSubmit(onSubmit)}>
        <Select
          {...register('lookupMode')}
          label="application.rentAuthorizationsLookupBy"
          options={lookupOptions}
          error={errors.lookupMode?.message}
          disabled={isPending}
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
      </Form>
    </FormContainer>
  );
};
