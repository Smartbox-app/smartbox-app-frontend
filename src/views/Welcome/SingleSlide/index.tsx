import React from 'react';
import { ButtonsContainer } from '../../../components/Layout';
import { Button } from '../../../components/Branded';
import styled from 'styled-components';
import { useTenant } from '../../../hooks/useTenant';
import './SingleSlide.scss';
import { useFileStorage } from 'src/hooks/useFileStorage';

interface Props {
  item: string;
  last?: boolean;
}

const StyledSlideContainer = styled.div<{ background: string }>`
  background-image: url(${(props) => props.background});
  background-size: cover;
  background-position: center;
`;

const SingleSlide = ({ item, last }: Props) => {
  const { tenant } = useTenant();
  const { getAssetPath } = useFileStorage();

  if (!tenant) return null;

  return (
    <StyledSlideContainer
      background={getAssetPath('background', tenant.background)}
      className="slide-container"
    >
      <div className="slide-overlayer"></div>
      <div className="slide-content">
        <div className="slide-description">
          <img src={getAssetPath('slide', item)} />
        </div>
        {last && (
          <ButtonsContainer className="swiper-buttons-container" center>
            <Button
              text="application.register"
              to="/register"
              primary
              className="swiper-button"
              big
            />
          </ButtonsContainer>
        )}
        <ButtonsContainer className="swiper-buttons-container" center>
          <Button
            text="application.back"
            to="/login"
            className="swiper-button back"
            big
          />
        </ButtonsContainer>
      </div>
    </StyledSlideContainer>
  );
};

export default SingleSlide;
