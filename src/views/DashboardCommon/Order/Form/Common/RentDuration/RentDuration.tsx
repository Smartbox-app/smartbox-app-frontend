import { differenceInCalendarDays } from 'date-fns';
import { useSelector } from 'react-redux';
import { ApplicationState } from 'src/reducers';
import styled from 'styled-components';

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
      Ilość dni najmu w wybranym zakresie: <strong>{difference}</strong>
    </StyledInfo>
  );
};
