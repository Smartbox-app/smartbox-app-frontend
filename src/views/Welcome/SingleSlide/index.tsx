import React from 'react';
import { Slide } from '../../../types/slide';
import { ButtonsContainer, LogoContainer } from '../../../components/Layout';
import { Button, Logo } from '../../../components/Common';
import './SingleSlide.scss';

interface Props {
  item: Slide;
  last?: boolean;
}

const SingleSlide = ({ item, last }: Props) => {
  const { header, text, subheader } = item;
  return (
    <div className="slide-container">
      <div className="slide-content">
        <h1 className="slide-header">{header}</h1>
        <div className="slide-subheader">{subheader}</div>
        <div className="slide-description">{text}</div>
        <ButtonsContainer>
          <Button big text="Zarejestruj się" to="/register" className="register-button"/>
        </ButtonsContainer>
      </div>
    </div>
  );
};

export default SingleSlide;
