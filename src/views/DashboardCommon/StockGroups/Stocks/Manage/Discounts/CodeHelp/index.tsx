import React from 'react';
import styled from 'styled-components';

import { Header } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';

const Box = styled('section')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing * 3,
  marginBottom: theme.spacing * 4,
  padding: theme.spacing * 4,
  borderRadius: theme.radius.outerSurface,
  background: theme.colors.surface.information.secondary,
  color: theme.colors.text.primary,
}));

const Example = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing,
}));

const Text = styled('p')({
  margin: 0,
});

const examples = [
  ['application.discountCodeHelpPercentTitle', 'application.discountCodeHelpPercent'],
  ['application.discountCodeHelpToPriceTitle', 'application.discountCodeHelpToPrice'],
  ['application.discountCodeHelpValueTitle', 'application.discountCodeHelpValue'],
] as const;

const CodeHelp = () => (
  <Box>
    <Header variant="h4">{__('application.discountCodeHelpTitle')}</Header>
    <Text>{__('application.discountCodeHelpIntro')}</Text>
    {examples.map(([title, body]) => (
      <Example key={title}>
        <Header variant="h5">{__(title)}</Header>
        <Text>{__(body)}</Text>
      </Example>
    ))}
  </Box>
);

export { CodeHelp };
