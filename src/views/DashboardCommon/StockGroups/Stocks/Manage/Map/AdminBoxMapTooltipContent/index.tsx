import React from 'react';
import { BoxMapRes, BoxStatus } from 'smartbox-types';
import { __ } from 'src/helpers/i18n';
import { TooltipLine } from 'src/components/ui';
import { translateBoxDisplayStatus } from 'src/utils/box-display-status';
import { useRent } from 'src/hooks/useRent';

type AdminBoxMapTooltipContentProps = {
  box: BoxMapRes;
};

export const AdminBoxMapTooltipContent = ({
  box,
}: AdminBoxMapTooltipContentProps) => {
  const { formatFinishAt, resolveRentFinishAt } = useRent();
  const status = box.status || BoxStatus.free;
  const finishAt = resolveRentFinishAt(box);
  const isOccupied =
    status !== BoxStatus.free && status !== BoxStatus.outOfService;

  const endDateLabel =
    finishAt || isOccupied
      ? formatFinishAt(finishAt, box.agreementType)
      : null;

  return (
    <>
      <TooltipLine>
        <strong>{box.identifier}</strong>
      </TooltipLine>
      <TooltipLine>
        {__('application.storeState')}: {translateBoxDisplayStatus(status)}
      </TooltipLine>
      {endDateLabel ? (
        <TooltipLine>
          {__('application.endDate')}: {endDateLabel}
        </TooltipLine>
      ) : null}
    </>
  );
};
