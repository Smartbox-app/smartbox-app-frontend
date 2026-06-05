import { BoxGroupUserRes } from 'smartbox-types';
import { StockImage } from 'src/icons/StockImage';
import ApiService from 'src/services/api-service';
import styled from 'styled-components';

export type OptionImageProps = {
  option: BoxGroupUserRes;
};

const StyledOptionWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing * 2.5,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}));

const StyledPlaceholder = styled('div')(({ theme }) => ({
  flex: 1,
  width: '100%',
  padding: theme.spacing * 2.5,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  svg: {
    fill: '#f8f8f7',
    width: '60%',
    height: '100%',
  },
}));

export const OptionImage = ({ option }: OptionImageProps) => {
  return (
    <>
      {option.image ? (
        <StyledOptionWrapper>
          <img
            src={`${ApiService.url}box-group-new/image/${option.id}`}
            alt={option.name}
          />
        </StyledOptionWrapper>
      ) : (
        <StyledPlaceholder>
          <StockImage />
        </StyledPlaceholder>
      )}
    </>
  );
};
