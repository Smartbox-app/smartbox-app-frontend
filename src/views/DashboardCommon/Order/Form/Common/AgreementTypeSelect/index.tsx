import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RentAgreementType } from 'smartbox-types';
import { setRentAgreementType } from '../../../../../../actions/order';
import { getColorForBackground } from '../../../../../../utils/color';
import styled from 'styled-components';
import { __ } from '../../../../../../helpers/i18n';
import { ApplicationState } from 'src/reducers';
import { Header, Section } from 'src/components/ui';

type AgreementTypeOptionProps = {
  type: RentAgreementType;
  label: string;
};

const StyledOption = styled('li')<{ isSelected: boolean }>(
  ({ isSelected, theme }) => ({
    padding: 16,
    border: `1px solid ${isSelected ? theme.colors.primary : '#e5e7eb'}`,
    background: isSelected ? theme.colors.primary : 'transparent',
    color: getColorForBackground(isSelected ? theme.colors.primary : '#ffffff'),
    boxShadow: theme.shadows.primary,
    marginBottom: 10,
    borderRadius: 16,
    cursor: 'pointer',
  }),
);

const AgreementTypeOption = ({ type, label }: AgreementTypeOptionProps) => {
  const dispatch = useDispatch();
  const agreementType = useSelector(
    (state: ApplicationState) => state.order.agreementType,
  );

  return (
    <StyledOption
      isSelected={agreementType === type}
      onClick={() => dispatch(setRentAgreementType(type))}
    >
      {__(label)}
    </StyledOption>
  );
};

export const AgreementTypeSelect = () => (
  <Section>
    <Header variant="h2">{__('application.agreementType')}</Header>
    <ul>
      <AgreementTypeOption
        type={RentAgreementType.FixedTerm}
        label="application.fixedTermAgreement"
      />
      <AgreementTypeOption
        type={RentAgreementType.OpenEnded}
        label="application.openEndedAgreement"
      />
    </ul>
  </Section>
);
