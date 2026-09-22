import { BoxMapRes, BoxStatus } from 'smartbox-types';
import { dateOnly } from 'src/utils/format-date';
import { __ } from 'src/helpers/i18n';
import { TooltipLine } from 'src/components/ui';
import { translateBoxDisplayStatus } from 'src/utils/box-display-status';

const hasDateValue = (value?: Date | string | null) =>
  value != null && value !== '';

export const getAdminBoxMapTooltipContent = (box: BoxMapRes) => {
  const status = box.status || BoxStatus.free;
  const endDate = hasDateValue(box.decisionFinishAt)
    ? box.decisionFinishAt
    : hasDateValue(box.finishAt)
      ? box.finishAt
      : null;

  return (
    <>
      <TooltipLine>
        <strong>{box.identifier}</strong>
      </TooltipLine>
      <TooltipLine>
        {__('application.storeState')}: {translateBoxDisplayStatus(status)}
      </TooltipLine>
      {endDate ? (
        <TooltipLine>
          {__('application.endDate')}: {dateOnly(endDate)}
        </TooltipLine>
      ) : null}
    </>
  );
};
