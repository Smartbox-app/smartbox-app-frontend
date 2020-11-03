import React, { Component } from 'react';
import Slider from 'react-slick';
import { ReactSVG } from 'react-svg';
import { usePricing } from 'smartbox-types';
import { __ } from '../../../helpers/i18n';
import CustomArrow from './CustomArrow';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './Carousel.scss';

interface Props {
  imagesList: number[];
}

class Carousel extends Component<Props> {
  private dataToDisplay = (listToPrint: any) => {
    const { pricing } = usePricing();
    return listToPrint.map((data: '3' | '6' | '9' | '12', key: number) => {
      const { weekly, monthly } = pricing[data];
      return (
        <div key={`carousel-${key}`} className="offer-svg-wrapper">
          <div className="offer-description">
            <p>
              {__('application.week')}: <strong>{weekly}zł</strong>
            </p>
            <p>
              {__('application.month')}: <strong>{monthly}zł</strong>
            </p>
          </div>
          <ReactSVG src={`/assets/icons/${data}c.svg`} />
        </div>
      );
    });
  };

  render() {
    const settings = {
      dots: true,
      infinite: true,
      speed: 300,
      slidesToShow: 1,
      slidesToScroll: 1,
      nextArrow: <CustomArrow right />,
      prevArrow: <CustomArrow left />,
    };

    const { imagesList } = this.props;

    return (
      <div className="slider-wrapper">
        <Slider {...settings}>{this.dataToDisplay(imagesList)}</Slider>
      </div>
    );
  }
}

export default Carousel;
