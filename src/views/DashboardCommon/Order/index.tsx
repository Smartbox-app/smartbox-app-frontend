import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router';

import { RentStatus } from 'smartbox-types';
import { showModal } from 'src/actions/modal';
import { ProgressIndicator } from 'src/components/Common';
import { UnpaidRentModal } from 'src/components/Common/UnpaidRentModal';
import { PageHeader, Section } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';
import { history } from 'src/history';
import { useTenantNaming } from 'src/hooks/useTenantNaming';
import {
  useGetMyDetailsQuery,
  useGetMyRentsQuery,
  useMyRentDetailsQuery,
} from 'src/queries';
import UserService from 'src/services/user-service';
import { findUnpaidRent } from 'src/utils/unpaid-extension';
import { Form } from 'src/views/DashboardCommon/Order/Form/Index';

export const Order = () => {
  const dispatch = useDispatch();
  const { getText } = useTenantNaming();
  const { data: user } = useGetMyDetailsQuery();
  const { data: rentsList = [], isPending: loadingRents } =
    useGetMyRentsQuery();
  const { step, rentId } = useParams<{
    step: string;
    rentId?: string;
  }>();

  const { data: extendRent } = useMyRentDetailsQuery(rentId);
  const unpaidRent = findUnpaidRent(rentsList);
  const isNewRentFlow = !rentId || step === 'stock' || step === 'size';

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
