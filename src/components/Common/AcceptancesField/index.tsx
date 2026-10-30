import { ChangeEvent } from 'react';
import styled from 'styled-components';
import { v4 } from 'uuid';

import { SingleAcceptance } from 'smartbox-types';
import { Button } from 'src/components/Branded';
import CheckBox from 'src/components/Common/CheckBox';
import Input from 'src/components/Common/Input';
import { ButtonsContainer } from 'src/components/Layout';
import { __ } from 'src/helpers/i18n';
import { useI18n } from 'src/i18n';

interface Props {
  value: SingleAcceptance[];
  onChange: (acceptances: SingleAcceptance[]) => void;
}

const StyledAcceptances = styled('div')(({ theme }) => ({
  borderBottom: `1px solid ${theme.colors.primary}`,
  marginTop: 12,
  paddingBottom: 16,
  marginBottom: 16,
}));

const StyledSingleAcceptance = styled('div')(({ theme }) => ({
  border: `1px solid ${theme.colors.primary}`,
  borderRadius: 6,
  padding: 8,
  marginBottom: 16,
}));

export const AcceptancesField = ({ value, onChange }: Props) => {
  const { t } = useI18n();
  const acceptances = value || [];

  const addAcceptance = () => {
    onChange([
      ...acceptances,
      { text: t('application.acceptanceText'), required: false, id: v4() },
    ]);
  };

  const updateAcceptanceText = (
    indexToChange: number,
    e: ChangeEvent<HTMLInputElement>,
  ) => {
    const { value } = e.target;

    const newAcceptances = acceptances.map((acceptance, index) => {
      if (index === indexToChange) {
        return {
          ...acceptance,
          text: value,
        };
      }
      return acceptance;
    });

    onChange(newAcceptances);
  };

  const updateAcceptanceRequired = (
    indexToChange: number,
    checked: boolean,
  ) => {
    const newAcceptances = acceptances.map((acceptance, index) => {
      if (index === indexToChange) {
        return {
          ...acceptance,
          required: checked,
        };
      }
      return acceptance;
    });

    onChange(newAcceptances);
  };

  const deleteAcceptance = (indexToDelete: number) => {
    const newAcceptances = acceptances.filter(
      (_, index) => index !== indexToDelete,
    );
    onChange(newAcceptances);
  };

  return (
    <div>
      <label className="input-label compact">
        {__('application.addonAcceptances')}
      </label>
      <StyledAcceptances>
        {acceptances.map((acceptance, index) => (
          <StyledSingleAcceptance key={index}>
            <p>
              {__('application.acceptanceId')} -{' '}
              <strong>{acceptance.id}</strong>
            </p>
            <Input
              type="text"
              input={{
                label: 'application.acceptanceText',
                name: `acceptance_text_${index}`,
                value: acceptance.text,
                onChange: (value: ChangeEvent<HTMLInputElement>) =>
                  updateAcceptanceText(index, value),
              }}
            />
            <CheckBox
              label={t('application.acceptanceRequired')}
              name={`acceptance_required_${index}`}
              checked={acceptance.required}
              handleChange={(checked: boolean) =>
                updateAcceptanceRequired(index, checked)
              }
            />
            <ButtonsContainer>
              <Button
                danger
                text="application.delete"
                click={() => deleteAcceptance(index)}
              />
            </ButtonsContainer>
          </StyledSingleAcceptance>
        ))}
        <ButtonsContainer>
          <Button text="application.addAddonAcceptance" click={addAcceptance} />
        </ButtonsContainer>
      </StyledAcceptances>
    </div>
  );
};
