import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import { AddonRes, AddonUserFileRequirementType } from 'smartbox-types';
import {
  selectAddon,
  setAddonAcceptance,
  setAddonFile,
} from 'src/actions/order';
import { Spinner } from 'src/components/Branded';
import {
  Alert,
  AsterixRequired,
  CheckBox,
} from 'src/components/Common';
import FileInput from 'src/components/Common/FileInput';
import { ButtonsContainer } from 'src/components/Layout';
import { Button, Header, Section, Typography } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';
import { useBridgeAddonsToRedux } from 'src/hooks/useBridgeOrderPriceQuery';
import { useFileStorage } from 'src/hooks/useFileStorage';
import { useAddonsForOrderQuery } from 'src/queries/useRentPriceQueries';
import { ApplicationState } from 'src/reducers';
import { OrderAddon } from 'src/reducers/order-reducer';
import { SingleVariant } from 'src/views/DashboardCommon/Order/Form/Common/Addons/SingleVariant';

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
  const addonsQuery = useAddonsForOrderQuery(stockId, boxGroupId);
  useBridgeAddonsToRedux(addonsQuery);

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
          <Header variant="h2">
            {addon.name} {addon.required ? <AsterixRequired /> : null}
          </Header>
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
              <p>{__('application.phrases.maxFileSize', { size: '5MB' })}</p>
              <FileInput
                input={{
                  value: orderAddons[addon.id].file,
                  onChange: (file) =>
                    handleAddonFile(
                      addon.id,
                      file instanceof File ? file : null,
                    ),
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
                    label={
                      <>
                        {acceptance.text}{' '}
                        {acceptance.required ? <AsterixRequired /> : null}
                      </>
                    }
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
