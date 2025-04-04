import React, { useEffect } from 'react';

import { withRouter, RouteComponentProps, useParams } from 'react-router';
import { FormContainer } from '../../../components/Layout';
import { ProgressIndicator } from '../../../components/Common';

import { Form } from './Form/Index';
import { useDispatch, useSelector } from 'react-redux';
import { getStockDiscountsList } from '../../../actions/stock';
import { ApplicationState } from 'src/reducers';
import { RentStatus } from 'smartbox-types';
import { getSingleRent } from '../../../actions/single-rent';
import { PageHeader, Section } from '../../../components/ui';
import { __ } from '../../../helpers/i18n';

export const Order = () => {
  const dispatch = useDispatch();
  const { singleRent } = useSelector((state: ApplicationState) => state.rent);
  const { step, paymentId, rentId } = useParams<{
    step: string;
    paymentId: string;
    rentId?: string;
  }>();

  useEffect(() => {
    dispatch(getStockDiscountsList());
  }, []);

  useEffect(() => {
    if (!rentId || paymentId) return;

    dispatch(getSingleRent(rentId));
  }, [rentId]);

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
    console.log('BRUH', singleRent);
    if (singleRent && singleRent.status === RentStatus.noPaidExtension)
      return 'application.debtPayOff';
    if (rentId) return 'application.extendsOrder';
    return 'application.newOrder';
  };

  return (
    <>
      <PageHeader>{__(getTitle())}</PageHeader>
      <Section>
        <ProgressIndicator
          current={getStepByName(step)}
          stepList={[
            {
              value: 1,
              desc: 'application.orderStepStock',
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
