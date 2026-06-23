import { BoxGroupUserRes } from 'smartbox-types';
import { useFileStorage } from 'src/hooks/useFileStorage';
import { StockImage } from 'src/icons/StockImage';
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
  const { getAssetPath } = useFileStorage();
  return (
    <>
      {imageUrl ? (
        <StyledOptionWrapper>
          <img
            src={getAssetPath('box-group', option.image)}
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
