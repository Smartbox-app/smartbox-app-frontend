import styled from 'styled-components';

const Content = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center',
  minHeight: '100vh',

}));

const Wrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  background: '#fff',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center',
  gap: theme.spacing * 4,
  borderRadius: theme.spacing * 4,
  padding: theme.spacing * 10,
  width: '100%',
  '@media(min-width: 768px)': {
    minWidth: 600,
  }
}));

export type InfoContentProps = {
  children: ReactNode;
};

export const InfoContent = ({children}: InfoContentProps) => {
  return (
    <Content>
      <Wrapper>{children}</Wrapper>
    </Content>
  );
};
