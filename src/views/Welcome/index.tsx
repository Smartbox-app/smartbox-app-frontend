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
    header: '',
    text: (
      <>
        <img src="/assets/images/Slide1/1.png" id="s1i1" className="slide-img"></img>
        <img src="/assets/images/Slide1/2.png" id="s1i2" className="slide-img"></img>
        <img src="/assets/images/Slide1/3.png" id="s1i3" className="slide-img"></img>
        <img src="/assets/images/Slide1/4.png" id="s1i4" className="slide-img"></img>
      </>
    )
  },
  {
    header: '',
    text: (
      <>
        <img src="/assets/images/Slide2/1.png" id="s2i1" className="slide-img"></img>
        <img src="/assets/images/Slide2/2.png" id="s2i2" className="slide-img"></img>
        <img src="/assets/images/Slide2/3.png" id="s2i3" className="slide-img"></img>
        <img src="/assets/images/Slide2/4.png" id="s2i4" className="slide-img"></img>
      </>
    )
  },
  {
    header: '',
    text: (
      <>
        <img src="/assets/images/Slide3/1.png" id="s3i1" className="slide-img"></img>
        <img src="/assets/images/Slide3/2.png" id="s3i2" className="slide-img"></img>
        <img src="/assets/images/Slide3/3.png" id="s3i3" className="slide-img"></img>
      </>
    )
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
        <Swiper pagination={{el: '.swiper-pagination', clickable: true}}>{items}</Swiper>
      </div>
    </Main>
  );
};

export default Welcome;
