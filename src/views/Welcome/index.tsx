import React from 'react';
import Swiper from 'react-id-swiper';
import SingleSlide from './SingleSlide';
import { Slide } from '../../types/slide';
import { useTenant } from '../../hooks/useTenant';
import './Welcome.scss';
import styled from 'styled-components';

const StyledWelcomeContainer = styled.div`
.swiper-pagination-bullet-active {
    opacity: 1;
    background: ${props => props.theme.colors.secondary};
  }
`

// const slides: Slide[] = [
//     {
//         header: 'first',
//         content: (
//             <>
//                 <img src="/assets/images/Slide1/1.png" className="slide-img slide-img-1"></img>
//                 <img src="/assets/images/Slide1/2.png" className="slide-img slide-img-2"></img>
//                 <img src="/assets/images/Slide1/3.png" className="slide-img slide-img-3"></img>
//                 <img src="/assets/images/Slide1/4.png" className="slide-img slide-img-4"></img>
//             </>
//         ),
//     },
//     {
//         header: 'second',
//         content: (
//             <>
//                 <img src="/assets/images/Slide2/1.png" className="slide-img slide-img-1"></img>
//                 <img src="/assets/images/Slide2/2.png" className="slide-img slide-img-2"></img>
//                 <img src="/assets/images/Slide2/3.png" className="slide-img slide-img-3"></img>
//                 <img src="/assets/images/Slide2/4.png" className="slide-img slide-img-4"></img>
//             </>
//         ),
//     },
//     {
//         header: 'third',
//         content: (
//             <>
//                 <img src="/assets/images/Slide3/1.png" className="slide-img slide-img-1"></img>
//                 <img src="/assets/images/Slide3/2.png" className="slide-img slide-img-2"></img>
//                 <img src="/assets/images/Slide3/3.png" className="slide-img slide-img-3"></img>
//                 {/* <img src="/assets/images/Slide3/4.png" className="slide-img slide-img-4"></img> */}
//                 {/* <img src="/assets/images/Slide3/3.png" className="slide3img3 slide-img"></img> */}
//             </>
//         ),
//     },
// ];

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
