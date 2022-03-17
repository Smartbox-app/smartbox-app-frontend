import React from 'react';
import { Link } from 'react-router-dom';
import { Slide } from '../../../types/slide';
import { ButtonsContainer } from '../../../components/Layout';
import { Button, Logo } from '../../../components/Common';
import './SingleSlide.scss';

interface Props {
  item: Slide;
  last?: boolean;
}

const SingleSlide = ({ item, last }: Props) => {
  const { content } = item;
  return (
    <div className="slide-container">
      <div className="slide-overlayer"></div>
      <div className="slide-logo">
        <Link to="/">
          <Logo />
        </Link>
      </div>
      <div className="slide-content">
        <div className="slide-description">{content}</div>
        {last && (
          <ButtonsContainer className="swiper-buttons-container">
            <Button text="application.register" to="/register" primary className="swiper-button" big />
          </ButtonsContainer>
        )}
        <ButtonsContainer className="swiper-buttons-container">
          <Button text="application.back" to="/login" className="swiper-button" big />
        </ButtonsContainer>
      </div>
    </div>
  );
};

export default SingleSlide;
