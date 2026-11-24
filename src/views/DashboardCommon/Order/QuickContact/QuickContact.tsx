import { rgba } from 'polished';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { Fab } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';
import { useTenant } from 'src/hooks/useTenant';
import { Close, Phone } from 'src/icons';

import { Action, ActionProps } from './components/Action';

const toWhatsAppPhone = (phone: string) => phone.replace(/\D/g, '');

const getActions = (phone: string): ActionProps[] => {
  const whatsAppPhone = toWhatsAppPhone(phone);

  return [
    {
      href: `tel:${phone}`,
      label: __('application.call'),
      iconClassName: 'fa-phone',
    },
    {
      href: `sms:${phone}`,
      label: __('application.sms'),
      iconClassName: 'fa-comment',
    },
    ...(whatsAppPhone
      ? [
          {
            href: `https://wa.me/${whatsAppPhone}`,
            label: __('application.whatsapp'),
            iconClassName: 'fa-whatsapp',
          },
        ]
      : []),
  ];
};

const StyledRoot = styled.div(({ theme }) => ({
  position: 'fixed',
  right: `calc(${theme.spacing * 3}px + env(safe-area-inset-right))`,
  bottom: `calc(${theme.spacing * 22}px + env(safe-area-inset-bottom))`,
  zIndex: 101,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  gap: theme.spacing * 2,

  '@media (min-width: 768px)': {
    bottom: `calc(${theme.spacing * 3}px + env(safe-area-inset-bottom))`,
  },
}));

const StyledBackdrop = styled.button({
  position: 'fixed',
  inset: 0,
  zIndex: 100,
  margin: 0,
  padding: 0,
  border: 'none',
  background: rgba(0, 0, 0, 0.2),
  cursor: 'default',
  transition: 'background-color .3s ease-in-out',
});

const StyledActions = styled.div(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  gap: theme.spacing * 2,
}));

export const QuickContact = () => {
  const { tenant } = useTenant();
  const [open, setOpen] = useState(false);
  const phone = tenant?.contactPhone?.trim();

  useEffect(() => {
    if (!open) return undefined;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open]);

  if (!phone) return null;

  const actions = getActions(phone);

  return (
    <>
      {open && (
        <StyledBackdrop
          type="button"
          aria-label={__('application.closeQuickContact')}
          onClick={() => setOpen(false)}
        />
      )}
      <StyledRoot>
        {open && (
          <StyledActions>
            {actions.map((action) => (
              <Action key={action.href} {...action} />
            ))}
          </StyledActions>
        )}
        <Fab
          variant="primary"
          aria-expanded={open}
          aria-label={
            open
              ? __('application.closeQuickContact')
              : __('application.openQuickContact')
          }
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <Close /> : <Phone />}
        </Fab>
      </StyledRoot>
    </>
  );
};
