import React from 'react';
import { ButtonsContainer, Section, SectionHeader } from '../../../../components/Layout';
import { Carousel } from '../../../../components/Common';
import { Button } from '../../../../components/Branded';
import { useDispatch, useSelector } from 'react-redux';
import { ApplicationState } from '../../../../reducers';
import { showModal } from '../../../../actions/modal';
import { NoPhoneModal } from '../../../../components/Common/Carousel/NoPhoneModal';
import UserService from '../../../../services/user-service';
import { history } from '../../../../App';
import './Offers.scss';

const Offers = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: ApplicationState) => state.user.details!);
  return <Section>
    <ButtonsContainer spaceBetween>
      {/* <SectionHeader title="application.offers" noMargin /> */}

      {/* <Button success small blank to="https://smartbox-storage.pl/jak-to-dziala/" text="application.how_it_works" /> */}
    </ButtonsContainer>
    {/* <Carousel imagesList={[3, 6, 9, 12]} /> */}
    <ButtonsContainer className='new-rent'>
      <Button
        text="application.newStock"
        primary
        big
        click={() => {
          if (!user.phone || user.phone.length < 7) {
            dispatch(showModal(<NoPhoneModal />));
          } else {
            // updateFormData({ size: data.toString() });
            history.push(`/${UserService.getSlugByRole(user.role)}/order/step/stock`);
          }
        }}
      />
    </ButtonsContainer>
  </Section>
}

export { Offers }
