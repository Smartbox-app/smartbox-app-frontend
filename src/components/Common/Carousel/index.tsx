import React, { Component } from 'react';
import { connect, useSelector } from 'react-redux';
import Slider from 'react-slick';
import { ReactSVG } from 'react-svg';
import { bindActionCreators } from 'redux';
import { usePricing, UserRole, UserRes } from 'smartbox-types';
import { order, modal } from '../../../actions';
import { history } from '../../../App';
import { __ } from '../../../helpers/i18n';
import { ApplicationState } from '../../../reducers';
import UserService from '../../../services/user-service';
import { ButtonsContainer } from '../../Layout';
import { Button } from '../../Branded';
import CustomArrow from './CustomArrow';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './Carousel.scss';
import { NoPhoneModal } from './NoPhoneModal';
import { FormType } from '../../../types/order-form';

interface Props {
    imagesList: (3 | 6 | 9 | 12)[];
    updateFormData: (data: Partial<FormType>) => void;
    showModal: (content: React.ReactNode) => void;
    hideModal: () => void;
}

class Carousel extends Component<Props> {
    private dataToDisplay = (listToPrint: (3 | 6 | 9 | 12)[]) => {
        const { pricing } = usePricing();
        const { updateFormData, showModal } = this.props;
        const user = useSelector((state: ApplicationState) => state.user.details);

        if (!user) return null;

        return listToPrint.map((data: 3 | 6 | 9 | 12, key: number) => {
            const { weekly, monthly } = pricing[data];
            return (
                <div key={`carousel-${key}`} className="offer-svg-wrapper">
                    <div className="offer-description">
                        <p>
                            {__('application.week')}: <strong>{weekly} zł</strong>
                        </p>
                        <p>
                            {__('application.month')}: <strong>{monthly} zł</strong>
                        </p>
                    </div>
                    <ReactSVG src={`/assets/icons/${data}c.svg`} />
                    <ButtonsContainer max>
                        <Button
                            text="application.newStock"
                            outline
                            icon="plus.svg"
                            click={() => {
                                if (!user.phone || user.phone.length < 7) {
                                    showModal(<NoPhoneModal />);
                                } else {
                                    updateFormData({ size: data.toString() });
                                    history.push(`/${UserService.getSlugByRole(user.role)}/order/step/stock`);
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


const mapDispatchToProps = (dispatch: any) =>
    bindActionCreators(
        {
            ...order,
            ...modal,
        },
        dispatch,
    );

export default connect(null, mapDispatchToProps)(Carousel);
