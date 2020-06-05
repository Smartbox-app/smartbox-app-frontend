import React, { Component } from 'react';
import Slider from 'react-slick';
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
      <div key={`carousel-${key}`}>
        <img src={data} alt="offer-screen" />
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
