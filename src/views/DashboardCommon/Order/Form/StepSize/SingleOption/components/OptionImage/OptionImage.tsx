import { BoxGroupUserRes } from 'smartbox-types';
import { StockImage } from 'src/icons/StockImage';
import { getBoxGroupImageUrl } from 'src/config/tenant-assets';
import { useTenant } from 'src/hooks/useTenant';
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
  const { tenant } = useTenant();
  const imageUrl = getBoxGroupImageUrl(option, tenant);

  return (
    <>
      {imageUrl ? (
        <StyledOptionWrapper>
          <img src={imageUrl} alt={option.name} />
        </StyledOptionWrapper>
      ) : (
        <StyledPlaceholder>
          <StockImage />
        </StyledPlaceholder>
      )}
    </>
  );
};
