import styled from 'styled-components';

const StyledColorIndicator = styled.span<{ $color: string }>`
  flex-shrink: 0;
  width: 14px;
  height: 14px;
  border-radius: 2px;
  background-color: ${({ $color }) => $color};
  box-shadow: 0 0 12px 0px rgba(0, 0, 0, 0.3);
`;

type Props = {
  color: string;
};

export const ColorIndicator = ({ color }: Props) => (
  <StyledColorIndicator $color={color} aria-hidden />
);
