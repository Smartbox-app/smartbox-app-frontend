import { BoxGroupUserRes } from 'smartbox-types';
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
        <span />
      )}
    </>
  );
};
