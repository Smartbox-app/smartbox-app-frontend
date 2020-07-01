import React, { Component } from 'react';
import Slider from 'react-slick';
import { ReactSVG } from 'react-svg';
import CustomeArrow from './CustomArrow';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './Carousel.scss';

interface Props {
  imagesList: string[];
}

class Carousel extends Component<Props> {
  private dataToDisplay = (listToPrint: any) =>
    listToPrint.map((data: string, key: number) => (
      <div key={`carousel-${key}`} className="offer-svg-wrapper">
        <ReactSVG src={`/assets/icons/${data}.svg`} />
      </div>
    ));

  render() {
    const settings = {
      dots: true,
      infinite: true,
      speed: 300,
      slidesToShow: 1,
      slidesToScroll: 1,
      nextArrow: <CustomeArrow right />,
      prevArrow: <CustomeArrow left />,
    };

    return (
      <div className="slider-wrapper">
        <Slider {...settings}>{this.dataToDisplay(this.props.imagesList)}</Slider>
      </div>
    );
  }
}

export default Carousel;
