import React from 'react';
import Swiper from 'react-id-swiper';
import SingleSlide from './SingleSlide';
import { Slide } from '../../types/slide';

import './Welcome.scss';
import { Main, LogoContainer } from '../../components/Layout';
//import { Logo, Header } from '../../components/Common';
//import useHeader from '../../hooks/useHeader';

const slides: Slide[] = [
  {
    header: 'first',
    content: (
      <>
        <div>
          <img src="/assets/images/Slide1/1.png" className="slide-img slide-img-1"></img>
          <img src="/assets/images/Slide1/2.png" className="slide-img slide-img-2"></img>
          {/* <img src="/assets/images/Slide1/3.png" className="slide-img slide-img-3"></img>
          <img src="/assets/images/Slide1/4.png" className="slide-img slide-img-4"></img> */}
        </div>
      </>
    ),
  },
  {
    header: 'second',
    content: (
      <>
        <div>
          <img src="/assets/images/Slide2/1.png" className="slide-img slide-img-1"></img>
          <img src="/assets/images/Slide2/2.png" className="slide-img  slide-img-2"></img>
          {/* <img src="/assets/images/Slide2/3.png" className="slide2img3 slide-img"></img>
          <img src="/assets/images/Slide2/4.png" className="slide2img4 slide-img"></img> */}
        </div>
      </>
    ),
  },
  {
    header: 'third',
    content: (
      <>
        <div>
          <img src="/assets/images/Slide3/1.png" className="slide-img slide-img-1"></img>
          <img src="/assets/images/Slide3/2.png" className="slide-img slide-img-2"></img>
          {/* <img src="/assets/images/Slide3/3.png" className="slide3img3 slide-img"></img> */}
        </div>
      </>
    ),
  },
];

const Welcome = () => {
  //useHeader('', '/', [], '', true);

  const items = slides.map((item: Slide, index: number) => (
    <div key={item.header}>
      <SingleSlide item={item} last={index === slides.length - 1} />
    </div>
  ));

  return (
    <Main>
      <div className="welcome-right">
        <Swiper pagination={{ el: '.swiper-pagination', clickable: true }}>{items}</Swiper>
      </div>
    </Main>
  );
};

export default Welcome;
