import { useDispatch, useSelector } from 'react-redux';
import { clearSelectedStock, setOrderStock } from 'src/actions/order';
import { Badge, Button, Card, Typography } from 'src/components/ui';
import { Map, SearchZoomIn } from 'src/icons';
import { ApplicationState } from 'src/reducers';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
0% {
opacity: 0;
}
100% {
opacity: 1;
}

`;

const StyledLocation = styled('div')`
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
  background: rgba(0, 0, 0, 0.5);
  animation-name: ${fadeIn};
  animation-duration: 0.3s;
`;

const CardContainer = styled('div')({
  height: 'auto',
  width: 250,
});

const Content = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  flexDirection: 'column',
  gap: theme.spacing * 2,
  flex: 1,
}));

const StyledHeader = styled('span')(({theme}) => ({
    marginBottom: theme.spacing * 2,
    fontWeight: 700
}))

export type ActiveLocationProps = {
  id: string;
  name: string;
  address: string;
};

export const ActiveLocation = ({ id, name, address }: ActiveLocationProps) => {
  const stockId = useSelector((state: ApplicationState) => state.order.stockId);
  const dispatch = useDispatch();

  const cancelChoice = () => {
    dispatch(clearSelectedStock())
  }

  return (
    <StyledLocation>
      <CardContainer>
        <Card active={id === stockId}>
          <Content>
            <StyledHeader>Twój wybór</StyledHeader>
            <Badge bold variant={id === stockId ? 'primary' : 'default'}>
              {name}
            </Badge>

            <Typography>{address}</Typography>
            <hr />
            <Button size='small' iconLeft={<Map />} text='Chcę zmienić wybór' onClick={cancelChoice} type='button'/>
          </Content>
        </Card>
      </CardContainer>
    </StyledLocation>
  );
};
