import React, { Component } from 'react';

export default class ScrollPosition extends Component {
  componentDidMount() {
    const el = document.querySelector('.order-agreement-wrapper');
    el && el.addEventListener('scroll', () => this.onScroll(el));
  }

  private onScroll = (el: any) => {
    if (el.scrollTop > 1300) {
      console.log(el.scrollTop);
    }
  };

  render() {
    return <div />;
  }
}
