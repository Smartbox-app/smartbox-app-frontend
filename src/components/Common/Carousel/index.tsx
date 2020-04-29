import React, { Component } from 'react';
import Slider from 'react-slick';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './Carousel.scss';

interface Props {
  imagesList: string[];
}

class Carousel extends Component<Props> {
  render() {
    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
    };

    console.log('asd');
    return (
      <div className="slider-wrapper">
        <Slider {...settings}>
          <div>
            {' '}
            <img src="http://placekitten.com/g/200/300" />
          </div>
          <div>
            {' '}
            <img src="http://placekitten.com/g/200/300" />
          </div>
          <div>
            {' '}
            <img src="http://placekitten.com/g/200/300" />
          </div>
        </Slider>
      </div>
    );
  }
}

export default Carousel;
