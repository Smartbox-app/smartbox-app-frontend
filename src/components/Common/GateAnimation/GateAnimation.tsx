import React from 'react';
import styled, { keyframes } from 'styled-components';
import { GateBig } from 'src/icons';

const AnimationContainer = styled.div`
  width: 220px;
  overflow: hidden;
`;

const AnimationWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 10px;
`;

const animation = keyframes`
  0% {
    transform: translateX(0);
        opacity: 0
  }
    10% {
        transform: translateX(0);
            opacity: 1
    }
  90% {
    transform: translateX(100%);
    opacity: 1
  }
  100% {
    transform: translateX(100%);
    opacity: 0
  }
`;

const AnimatedGate = styled.div`
  animation: ${animation} 5s ease-in-out infinite;
  svg {
    fill: ${({ theme }) => theme.colors.primary};
  }
`;

export const GateAnimation = () => {
  return (
    <AnimationWrapper>
      <AnimationContainer>
        <AnimatedGate>
          <GateBig />
        </AnimatedGate>
      </AnimationContainer>
    </AnimationWrapper>
  );
};
