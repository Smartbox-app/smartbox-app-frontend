import styled, { keyframes } from 'styled-components';

const flash = keyframes`
    0% {
        background-color: #F5F5F5;
    }
    100% {
        background-color: #E2E2E2;
    }
`;

const StyledSkeleton = styled.div<{ width?: number | string; radius?: number; height: number }>`
  width: ${({ width }) => width || '100%'};
  height: ${({ height }) => height}px;
  border-radius: ${({ theme, radius }) => radius || theme.spacing}px;
  animation: ${flash} 1s linear infinite alternate;
  flex: 1,
`;

export type SkeletonProps = {
  width?: number | string;
  radius?: number;
  height: number;
};

export const Skeleton = ({ width, height, radius }: SkeletonProps) => {
  return <StyledSkeleton width={width} height={height} radius={radius}/>;
};
