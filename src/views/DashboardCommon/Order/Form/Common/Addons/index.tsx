import { useEffect } from 'react';
import { Spinner } from '../../../../../../components/Branded';
import { ButtonsContainer } from '../../../../../../components/Layout';
import { useDispatch, useSelector } from 'react-redux';
import { ApplicationState } from '../../../../../../reducers';
import styled from 'styled-components';
import { Alert, AsterixRequired, CheckBox } from '../../../../../../components/Common';
import {
  fetchAddons,
  selectAddon,
  setAddonAcceptance,
  setAddonFile,
} from '../../../../../../actions/order';
import { SingleVariant } from './SingleVariant';

import FileInput from '../../../../../../components/Common/FileInput';
import { AddonRes, AddonUserFileRequirementType } from 'smartbox-types';
import { OrderAddon } from 'src/reducers/order-reducer';
import { Button, Header, Section, Typography } from 'src/components/ui';
import { useFileStorage } from 'src/hooks/useFileStorage';

const StyledFileDescription = styled('div')(({ theme }) => ({
  background: theme.colors.background.secondary,
  borderRadius: theme.radius.innerSurface,
  padding: theme.spacing * 4,
}));

const StyledUserFileContainer = styled('div')(({ theme }) => ({
  background: theme.colors.background.secondary,
  borderRadius: theme.radius.innerSurface,
  padding: theme.spacing * 4,
}));

interface Props {
  stockId: string;
  boxGroupId: string;
}

export const Addons = ({ stockId, boxGroupId }: Props) => {
  const { getAssetPath } = useFileStorage();
  const { addons, loadingAddons, orderAddons } = useSelector(
    (state: ApplicationState) => state.order,
  );
  const dispatch = useDispatch();

  const getAddons = () => {
    dispatch(fetchAddons(stockId, boxGroupId));
  };

  const handleAddonAcceptance = (
    addonId: string,
    acceptanceId: string,
    checked: boolean,
  ) => {
    dispatch(setAddonAcceptance(addonId, acceptanceId, checked));
  };

  const handleAddonFile = (addonId: string, file: File | null) => {
    dispatch(setAddonFile(addonId, file));
  };

  const selectVariant = (
    addonId: string,
    variantId: string,
    variantName: string,
  ) => {
    dispatch(selectAddon(addonId, variantId, variantName));
  };

  useEffect(() => {
    getAddons();
  }, []);

  const displayFileInput = (
    { userFileAllowed, userFileText, userFileRequirement }: AddonRes,
    { selectedVariant }: OrderAddon,
  ) => {
    if (!userFileAllowed || !userFileText) return false;
    if (
      userFileRequirement ===
        AddonUserFileRequirementType.RequiredWhenNoVariant &&
      selectedVariant
    )
      return false;
    return true;
  };

  useEffect(() => {
    addons.forEach((addon) => {
      const defaultVariant = addon.pricing.find((variant) => variant.default);
      if (defaultVariant) {
        selectVariant(addon.id, defaultVariant.id, defaultVariant.name);
      }
    });
  }, [addons]);

  const getSortingCriteria = (a: AddonRes, b: AddonRes) => {
    if (a.order && b.order) return a.order - b.order;
    return 0;
  };

  const sortedAddons = [...addons].sort((a, b) => getSortingCriteria(a, b));

  if (loadingAddons) return <Spinner />;
  if (!addons || addons.length === 0) return null;

  return (
    <>
      {sortedAddons.map((addon) => (
        <Section key={addon.id}>
          <Header variant="h2">{addon.name} {addon.required ? <AsterixRequired /> : null}</Header>
          {addon.description ? (
            <Typography>{addon.description}</Typography>
          ) : null}
          {addon.file && addon.fileText ? (
            <StyledFileDescription>
              <p>{addon.fileText}</p>
              <ButtonsContainer>
                <Button
                  text="application.seeFile"
                  size="large"
                  href={getAssetPath('addon', addon.file)}
                />
              </ButtonsContainer>
            </StyledFileDescription>
          ) : null}
          {addon.required ? (
            <Alert type="notice" text="application.addonIsRequired" />
          ) : null}

          {!addon.noPricing ? (
            <ul>
              {addon.pricing.map((variant) => (
                <SingleVariant
                  key={variant.id}
                  variant={variant}
                  addon={addon}
                  addonId={addon.id}
                  display={addon.display}
                />
              ))}
            </ul>
          ) : null}
          {displayFileInput(addon, orderAddons[addon.id]) ? (
            <StyledUserFileContainer>
              <p>{addon.userFileText}</p>
              <p>Maksymalny dopuszczalny rozmiar pliku: <strong>5MB</strong></p>
              <FileInput
                input={{
                  value: orderAddons[addon.id].file,
                  onChange: (file) =>
                    handleAddonFile(addon.id, file instanceof File ? file : null),
                }}
                accept=".jpg,.jpeg,.png,.pdf,.docx"
                multiple={false}
                meta={{
                  error: null,
                }}
              />
            </StyledUserFileContainer>
          ) : null}
          {addon.additionalDescription ? (
            <Typography>{addon.additionalDescription}</Typography>
          ) : null}
          {(orderAddons[addon.id].selectedVariant || addon.noPricing) &&
          addon.acceptances
            ? addon.acceptances.map((acceptance) => (
                <div key={acceptance.id}>
                  <CheckBox
                    label={<>{acceptance.text} {acceptance.required ? <AsterixRequired /> : null}</>}
                    name={`acceptance_${acceptance.id}`}
                    checked={
                      orderAddons[addon.id].acceptancesStatus[acceptance.id]
                        .accepted
                    }
                    handleChange={(checked: boolean) =>
                      handleAddonAcceptance(addon.id, acceptance.id, checked)
                    }
                  />
                </div>
              ))
            : null}
        </Section>
      ))}
    </>
  );
};
