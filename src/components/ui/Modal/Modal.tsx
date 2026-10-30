import { lighten } from 'polished';
import React, { createContext, useContext } from 'react';
import styled from 'styled-components';

import { Header } from 'src/components/ui/Header';
import { Close } from 'src/icons';
import { colorOrDark } from 'src/utils/color';

type ModalContextValue = {
  onClose?: () => void;
  closable?: boolean;
};

const ModalContext = createContext<ModalContextValue>({});

const useModalContext = () => useContext(ModalContext);

const modalPaddingX = (spacing: number) => spacing * 4;
const modalPaddingTop = (spacing: number) => spacing * 4;
const modalPaddingBottom = (spacing: number) => spacing * 4;
const modalSectionGap = (spacing: number) => spacing * 4;

const StyledModalRoot = styled.div(({ theme }) => ({
  position: 'relative',
  zIndex: 1,
  transition: '0.3s',
  overflow: 'auto',
  height: '100%',
  boxShadow: `0 0 ${theme.spacing * 1.5}px ${theme.spacing / -2}px rgba(0, 0, 0, 0.5)`,
  backgroundColor: theme.colors.background.primary,
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
}));

const StyledHeaderRow = styled.div(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing * 2,
  flexShrink: 0,
  padding: `${theme.spacing * 4}px`,
  borderBottom: `1px solid #eee`,
}));

const StyledHeaderText = styled.div(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing,
  minWidth: 0,
}));

const StyledCloseButton = styled.button(({ theme }) => ({
  border: 'none',
  background: 'transparent',
  cursor: 'pointer',
  svg: {
    fill: theme.colors.primary,
    width: theme.spacing * 4.5,
    height: theme.spacing * 4.5,
  },

  '&:hover': {
    svg: {
      fill: lighten(0.2, colorOrDark(theme.colors.primary)),
    },
  },
}));

const StyledContent = styled.div(({ theme }) => {
  const spacing = theme.spacing;
  const paddingX = modalPaddingX(spacing);
  const paddingY = modalSectionGap(spacing);

  return {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing * 4,
    flex: 1,
    minHeight: 0,
    padding: `${paddingY}px ${paddingX}px`,

    '[data-modal-root] > &:only-child': {
      padding: `${modalPaddingTop(spacing)}px ${paddingX}px ${modalPaddingBottom(spacing)}px`,
    },

    '[data-modal-root] > &:first-child:not(:only-child)': {
      paddingTop: modalPaddingTop(spacing),
    },

    '[data-modal-root] > &:last-child:not(:only-child)': {
      paddingBottom: modalPaddingBottom(spacing),
    },
  };
});

const StyledActions = styled.div(({ theme }) => {
  const spacing = theme.spacing;
  const paddingX = modalPaddingX(spacing);
  const paddingY = modalSectionGap(spacing);

  return {
    padding: `${paddingY}px ${paddingX}px ${modalPaddingBottom(spacing)}px`,
    borderTop: `1px solid #eee`,
    '[data-modal-root] > &:only-child': {
      padding: `${modalPaddingTop(spacing)}px ${paddingX}px ${modalPaddingBottom(spacing)}px`,
    },

    '@media (min-width: 768px)': {
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
      gap: theme.spacing * 2,
      flexShrink: 0,
      flexWrap: 'wrap',
    },
  };
});

export type ModalRootProps = {
  children: React.ReactNode;
  onClose?: () => void;
  closable?: boolean;
};

const ModalRoot = ({ children, onClose, closable = true }: ModalRootProps) => {
  return (
    <ModalContext.Provider value={{ onClose, closable }}>
      <StyledModalRoot data-modal-root>{children}</StyledModalRoot>
    </ModalContext.Provider>
  );
};
ModalRoot.displayName = 'Modal';

export type ModalHeaderProps = {
  title?: React.ReactNode;
  right?: React.ReactNode;
};

const ModalHeader = ({ title, right }: ModalHeaderProps) => {
  const { onClose, closable } = useModalContext();

  return (
    <StyledHeaderRow>
      <StyledHeaderText>
        {title ? <Header variant="h2">{title}</Header> : null}
      </StyledHeaderText>
      {right ??
        (closable && onClose ? (
          <StyledCloseButton type="button" aria-label="Close" onClick={onClose}>
            <Close />
          </StyledCloseButton>
        ) : null)}
    </StyledHeaderRow>
  );
};

export type ModalContentProps = {
  children: React.ReactNode;
};

const ModalContent = ({ children }: ModalContentProps) => {
  return <StyledContent>{children}</StyledContent>;
};

export type ModalActionsProps = {
  children: React.ReactNode;
};

const ModalActions = ({ children }: ModalActionsProps) => {
  return <StyledActions>{children}</StyledActions>;
};

export const Modal = Object.assign(ModalRoot, {
  Header: ModalHeader,
  Content: ModalContent,
  Actions: ModalActions,
});
