import React, { useEffect } from 'react';

import { useParams } from 'react-router';
import { ProgressIndicator } from '../../../components/Common';

import { Form } from './Form/Index';
import { useDispatch } from 'react-redux';
import { getStockDiscountsList } from '../../../actions/stock';
import { showModal } from '../../../actions/modal';
import { RentStatus } from 'smartbox-types';
import { PageHeader, Section } from '../../../components/ui';
import { __ } from '../../../helpers/i18n';
import { useTenantNaming } from 'src/hooks/useTenantNaming';
import {
  useGetMyDetailsQuery,
  useGetMyRentsQuery,
  useMyRentDetailsQuery,
} from 'src/queries';
import { UnpaidRentModal } from 'src/components/Common/UnpaidRentModal';
import { history } from 'src/history';
import UserService from 'src/services/user-service';
import { findUnpaidRent } from 'src/utils/unpaid-extension';

export const Order = () => {
  const dispatch = useDispatch();
  const { getText } = useTenantNaming();
  const { data: user } = useGetMyDetailsQuery();
  const { data: rentsList = [], isPending: loadingRents } =
    useGetMyRentsQuery();
  const { step, paymentId, rentId } = useParams<{
    step: string;
    paymentId: string;
    rentId?: string;
  }>();

  const { data: extendRent } = useMyRentDetailsQuery(rentId);
  const unpaidRent = findUnpaidRent(rentsList);
  const isNewRentFlow = !rentId || step === 'stock' || step === 'size';

  useEffect(() => {
    dispatch(getStockDiscountsList());
  }, []);

  useEffect(() => {
    if (!user || !isNewRentFlow || loadingRents || !unpaidRent) {
      return;
    }
    dispatch(showModal(<UnpaidRentModal rent={unpaidRent} />));
    history.replace(`/${UserService.getSlugByRole(user.role)}/main`);
  }, [user, isNewRentFlow, loadingRents, unpaidRent]);

  const getStepByName = (stepName: string) => {
    switch (stepName) {
      case 'stock':
        return 1;
      case 'size':
        return 2;
      case 'duration':
        return 3;
      case 'summary':
        return 4;
      case 'agreement':
        return 5;
      case 'payment':
        return 6;
      default:
        return 1;
    }
  };

  const getTitle = () => {
    if (extendRent && extendRent.status === RentStatus.noPaidExtension)
      return 'application.debtPayOff';
    if (rentId) return 'application.extendsOrder';
    return 'application.newOrder';
  };

  if (isNewRentFlow && (loadingRents || unpaidRent)) {
    return null;
  }

  return (
    <>
      <PageHeader>{__(getTitle())}</PageHeader>
      <Section>
        <ProgressIndicator
          current={getStepByName(step)}
          stepList={[
            {
              value: 1,
              desc: getText('name')
            },
            {
              value: 2,
              desc: 'application.orderStepSize',
            },
            {
              value: 3,
              desc: 'application.orderStepDate',
            },
            {
              value: 4,
              desc: 'application.orderStepSummary',
            },
            {
              value: 5,
              desc: 'application.orderStepAgreement',
            },
            {
              value: 6,
              desc: 'application.orderStepPayment',
            },
          ]}
        />
      </Section>

      <Form />
    </>
  );
};
