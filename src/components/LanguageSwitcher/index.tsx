import styled from 'styled-components';
import { useGetMyDetailsQuery } from 'src/queries';
import { useUpdateMyLangMutation } from 'src/mutations/useUpdateMyLangMutation';
import { i18n } from 'src/helpers/i18n';
import { currentAppLanguage, type AppLanguage } from 'src/i18n/app-language';
import { useState } from 'react';
import { SidebarButton } from '../ui/SidebarButton';

const OPTIONS: { value: AppLanguage; label: string }[] = [
  { value: 'pl', label: 'PL' },
  { value: 'en', label: 'EN' },
];

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

const LanguageSwitcherWrapper = styled.div(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-end',
  padding: `${theme.spacing * 2}px ${theme.spacing * 4}px`,
}));

export const LanguageSwitcher = () => {
  const { data: user, isFetched } = useGetMyDetailsQuery();
  const { mutate, isPending } = useUpdateMyLangMutation();
  const [opened, setOpened] = useState(false);
  const current = currentAppLanguage();

  const select = (lang: AppLanguage) => {
    if (!isFetched || isPending || lang === current) return;

    if (user) {
      mutate(lang);
      return;
    }

    i18n.changeLang(lang);
  };

  return (
    <LanguageSwitcherWrapper>
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
