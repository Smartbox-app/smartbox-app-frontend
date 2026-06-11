import React from 'react';
import { useTenant } from 'src/hooks/useTenant';
import { useGetVersionQuery } from 'src/queries';
import { getColorForBackground } from 'src/utils/color';
import { textToSimpleMD } from 'src/utils/text-to-simple-md';
import styled from 'styled-components';

const StyledAppMessage = styled.div`
  padding: ${(props) => props.theme.spacing * 4}px;
  padding-top: calc(${(props) => props.theme.spacing * 2}px + env(safe-area-inset-top));
  background-color: ${(props) => props.theme.colors.primary};
  color: ${(props) => getColorForBackground(props.theme.colors.primary)};
  font-size: 12px;
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing * 2}px;
`;

export const AppMessage = () => {
  const { tenant } = useTenant();
  const { data: config } = useGetVersionQuery();

  const messages: string[] = [
    tenant?.systemMessage,
    ...(config?.messages ?? []),
  ].filter((message) => !!message) as string[];

  if (!messages.length) return null;

  return (
    <StyledAppMessage>
      {messages.map((message, index) => (
        <div key={index}>{textToSimpleMD(message)}</div>
      ))}
    </StyledAppMessage>
  );
};
