import { useDispatch, useSelector } from 'react-redux';
import { RentPaymentType } from 'smartbox-types';
import { setRentPaymentType } from '../../../../../../../actions/order';
import { getColorForBackground } from '../../../../../../../utils/color';
import styled from 'styled-components';
import { __ } from '../../../../../../../helpers/i18n';
import { ApplicationState } from 'src/reducers';

type Props = {
  type: RentPaymentType;
  label: string;
};

const StyledPaymentType = styled('li')<{ isSelected: boolean }>(
  ({ isSelected, theme }) => ({
    padding: 16,
    border: `1px solid ${isSelected ? theme.colors.primary : '#e5e7eb'}`,
    background: isSelected ? theme.colors.primary : 'transparent',
    color: getColorForBackground(isSelected ? theme.colors.primary : '#ffffff'),
    boxShadow: theme.shadows.primary,
    marginBottom: 10,
    borderRadius: 16,
    cursor: 'pointer',

    '&:hover': {
      background: isSelected ? theme.colors.primary : '#eee',
    },

    '@media (min-width: 480px)': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
  }),
);

const StyledPaymentName = styled('p')({
  margin: 0,
  fontWeight: 500,
  fontSize: '0.9rem',
});

export const SinglePaymentType = ({ type, label }: Props) => {
  const dispatch = useDispatch();
  const { rentPaymentType } = useSelector(
    (state: ApplicationState) => state.order,
  );

  const handleSelect = () => {
    dispatch(setRentPaymentType(type));
  };

  return (
    <StyledPaymentType
      isSelected={rentPaymentType === type}
      onClick={handleSelect}
    >
      <StyledPaymentName>{__(label)}</StyledPaymentName>
    </StyledPaymentType>
  );
};
