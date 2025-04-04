import Swiper from 'react-id-swiper';
import SingleSlide from './SingleSlide';
import { useTenant } from '../../hooks/useTenant';
import './Welcome.scss';
import styled from 'styled-components';
import { getColorForBackground } from '../../utils/color';

const StyledWelcomeContainer = styled.div`
.swiper-pagination-bullet-active {
    opacity: 1;
    background: ${props => props.theme.colors.secondary};
    color: ${props => getColorForBackground(props.theme.colors.primary)};
  }
`

const Welcome = () => {
    //useHeader('', '/', [], '', true);
    const { tenant } = useTenant();

    if(!tenant) return null;

    const items = tenant.slides.map((item: string, index: number) => (
        <div key={item}>
            <SingleSlide item={item} last={index === tenant.slides.length - 1} />
        </div>
    ));

    return (
        <StyledWelcomeContainer className="welcome-container">
            <Swiper pagination={{ el: '.swiper-pagination', clickable: true }}>{items}</Swiper>
        </StyledWelcomeContainer>
    );
};

export default Welcome;
