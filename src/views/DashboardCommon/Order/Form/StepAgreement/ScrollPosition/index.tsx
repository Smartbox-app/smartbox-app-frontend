import React, { Component } from 'react';
import { connect } from 'react-redux';

interface Props {
  register: any;
}

class ScrollPosition extends Component<Props> {
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
    const { register } = this.props;
    return (
      <>
        <input
          name="agreement-accepted"
          type="checkbox"
          // value={true}
          id="test"
          ref={register({ required: true })}
        />
      </>
    );
  }
}

export default connect()(ScrollPosition);
