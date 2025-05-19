import { ReactNode } from "react"
import styled from "styled-components";
import { Header } from "../Header";

export type HeaderWithActionsProps = {
    children: ReactNode;
    actions: ReactNode;
}

const StyledHeader = styled('div')(({theme}) => ({
    gap: theme.spacing * 4,
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: `${theme.spacing * 4}px 0`,
    borderBottom: `1px solid ${theme.colors.border.secondary}`,
    '@media(min-width: 768px)': {
        flexDirection: 'row'
    }
}))

export const HeaderWithActions = ({ children, actions}: HeaderWithActionsProps) => (
    <StyledHeader>
        <Header variant='h2'>{children}</Header>
        {actions}
    </StyledHeader>
)