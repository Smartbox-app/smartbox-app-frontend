import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Form, Input, Section } from 'src/components/ui';
import { setDiscountCode } from 'src/actions/order';
import { notifications } from 'src/actions';
import { __ } from 'src/helpers/i18n';
import { useForm } from 'react-hook-form';
import { DiscountCodeDto } from 'src/dto/DiscountCodeDto';
import { ClassValidatorResolver } from 'src/resolvers/ClassValidatorResolver';
import { useDiscountCodeMutation } from 'src/mutations';
import styled from 'styled-components';

interface Props {
  stockId: string;
  rentStart: Date;
  rentEnd: Date;
}

const DiscountRow = styled('div')(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing * 2,

  flexDirection: 'column',
  '@media(min-width: 500px)': {
    flexDirection: 'row',
    alignItems: 'flex-end',
  }
}));

export const DiscountForm = ({ stockId, rentEnd, rentStart }: Props) => {
  const {
    handleSubmit,
    reset,
    register,
    formState: { errors, isValid },
  } = useForm<DiscountCodeDto>({
    mode: 'onSubmit',
    resolver: ClassValidatorResolver(new DiscountCodeDto()),
  });
  const dispatch = useDispatch();

  const { mutate, isPending, data } = useDiscountCodeMutation(stockId);

  const onSubmit = (data: DiscountCodeDto) => {
    if (!isValid) return;
    mutate(data);
  };

  useEffect(() => {
    reset({
      startDate: rentStart,
      endDate: rentEnd,
    });
  }, [rentStart, rentEnd]);

  useEffect(() => {
    if (!data) return;
    dispatch(
      notifications.successNotification('notification.discountCodeRead'),
    );
    dispatch(setDiscountCode(data.code));
  }, [data]);

  return (
    <Section>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <DiscountRow>
          <Input
            {...register('code')}
            label="application.passYourDiscountCode"
            error={errors.code?.message}
          />
          <Button
            size="large"
            variant="primary"
            text="application.apply"
            type="submit"
          />
        </DiscountRow>
      </Form>
    </Section>
  );
};
