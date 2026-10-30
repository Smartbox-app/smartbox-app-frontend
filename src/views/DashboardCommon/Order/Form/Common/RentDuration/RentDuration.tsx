import { differenceInCalendarDays } from 'date-fns';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import { __ } from 'src/helpers/i18n';
import { ApplicationState } from 'src/reducers';

const StyledInfo = styled.div`
  text-align: center;
  padding: 10px;
`;

export const RentDuration = () => {
  const { startDate, endDate } = useSelector(
    (state: ApplicationState) => state.order,
  );

  if (!endDate) return null;

  const difference = differenceInCalendarDays(endDate, startDate) + 1;

  return (
    <StyledInfo>
      {__('application.phrases.rentDayCount')} <strong>{difference}</strong>
    </StyledInfo>
  );
};
