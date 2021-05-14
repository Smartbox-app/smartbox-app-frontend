import React, { Component } from 'react';
import { connect } from 'react-redux';
import Slider from 'react-slick';
import { ReactSVG } from 'react-svg';
import { bindActionCreators } from 'redux';
import { usePricing, UserRole } from 'smartbox-types';
import { order, modal } from '../../../actions';
import { history } from '../../../App';
import { __ } from '../../../helpers/i18n';
import { ApplicationState } from '../../../reducers';
import { UserCommonEntity } from '../../../reducers/user-reducer';
import UserService from '../../../services/user-service';
import { ButtonsContainer } from '../../Layout';
import { Button, ConfirmModal } from '../index';
import CustomArrow from './CustomArrow';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './Carousel.scss';
import NoPhoneModal from './NoPhoneModal';

interface Props {
  imagesList: number[];
  userRole: UserRole;
  user: UserCommonEntity;
  updateFormData: (data: any) => void;
  showModal: (content: React.ReactNode) => void;
  hideModal: () => void;
}

class Carousel extends Component<Props> {
  private dataToDisplay = (listToPrint: any) => {
    const { pricing } = usePricing();
    const { updateFormData, userRole, user, showModal, hideModal } = this.props;

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
          <ButtonsContainer max>
            <Button
              text={__('application.newStock')}
              outline
              icon="plus.svg"
              click={() => {
                if (user.phone.length < 7) {
                  showModal(<NoPhoneModal />);
                } else {
                  updateFormData({ size: `${data}` });
                  history.push(`/${UserService.getSlugByRole(userRole)}/order/step/size`);
                }
              }}
            />
          </ButtonsContainer>
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

const mapStateToProps = (state: ApplicationState) => ({
  userRole: state.user.details.role,
  user: state.user.details,
});

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      ...order,
      ...modal,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(Carousel);
