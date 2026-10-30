import { useState } from 'react';
import styled from 'styled-components';

import { SidebarButton } from 'src/components/ui/SidebarButton';
import { i18n } from 'src/helpers/i18n';
import {
  currentAppLanguage,
  SUPPORTED_LANGUAGES,
  type AppLanguage,
} from 'src/i18n/app-language';
import { useUpdateMyLangMutation } from 'src/mutations/useUpdateMyLangMutation';
import { useGetMyDetailsQuery } from 'src/queries';

const OPTIONS: { value: AppLanguage; label: string }[] = SUPPORTED_LANGUAGES.map(
  (value) => ({ value, label: value.toUpperCase() }),
);

const StyledSwitcherContainer = styled.div({
  position: 'relative',
  overflow: 'visible',
});

const StyledLangButton = styled.button(({ theme }) => ({
  padding: `${theme.spacing}px ${theme.spacing * 2}px`,
  border: 'none',
  borderRadius: theme.radius.innerSurface,
  background: 'transparent',
  color: theme.colors.text.primary,
  fontSize: 13,
  lineHeight: '18px',
  fontWeight: 400,
  cursor: 'pointer',

  '&:disabled': {
    cursor: 'default',
    opacity: 0.6,
  },
  '&:hover': {
    background: theme.colors.border.secondary,
  },
}));

const StyledSwitcherCard = styled('div')(({ theme }) => ({
  position: 'absolute',
  right: 0,
  marginTop: theme.spacing,
  borderRadius: theme.radius.innerSurface,
  background: theme.colors.background.primary,
  boxShadow: theme.shadows.primary,
  gap: theme.spacing,
  minHeight: 'auto',
  height: 'auto',
  padding: `${theme.spacing}px ${theme.spacing * 2}px`,
  display: 'flex',
  flexDirection: 'column',
  zIndex: 9,
  // width: '100%',q
}));

const LanguageSwitcherWrapper = styled.div<{ $dashboard?: boolean }>(({ theme, $dashboard }) => ({
  display: 'flex',
  justifyContent: 'flex-end',
  padding: `${theme.spacing * 2}px ${theme.spacing * 4}px`,
  marginBottom: $dashboard ? 0 : theme.spacing * -12,
  zIndex: 2,
  position: 'relative',
}));

export type LanguageSwitcherProps = {
  dashboard?: boolean;
};

export const LanguageSwitcher = ({ dashboard }: LanguageSwitcherProps) => {
  const { data: user, isFetched } = useGetMyDetailsQuery();
  const { mutate, isPending } = useUpdateMyLangMutation();
  const [opened, setOpened] = useState(false);
  const current = currentAppLanguage();

  const select = (lang: AppLanguage) => {
    if (!isFetched || isPending || lang === current) return;

    if (user) {
      mutate(lang, { onSuccess: () => window.location.reload() });
      return;
    }

    i18n.changeLang(lang);
  };

  return (
    <LanguageSwitcherWrapper $dashboard={dashboard}>
      <StyledSwitcherContainer>
        <SidebarButton small onClick={() => setOpened(!opened)}>
          <strong>{current.toLocaleUpperCase()}</strong>
        </SidebarButton>
        {opened ? (
          <StyledSwitcherCard role="group" aria-label="Language">
            {OPTIONS.filter((option) => option.value !== current).map(
              (option) => (
                <StyledLangButton
                  key={option.value}
                  type="button"
                  aria-pressed={current === option.value}
                  disabled={!isFetched || isPending}
                  onClick={() => select(option.value)}
                >
                  {option.label}
                </StyledLangButton>
              ),
            )}
          </StyledSwitcherCard>
        ) : null}
      </StyledSwitcherContainer>
    </LanguageSwitcherWrapper>
  );
};
