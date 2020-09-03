import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { UserRes } from 'smartbox-types';
import { Button } from '../../../../../components/Common';
import { ButtonsContainer } from '../../../../../components/Layout';
import { ApplicationState } from '../../../../../reducers';

interface Props {
  user: UserRes;
  paymentId: string;
}

const Invoice = ({}: Props) => {
  return (
    <div>
      <h3>Dziękujemy za korzystanie z naszych usług</h3>
      <ButtonsContainer max>
        <Button text="Wygeneruje fakturę" />
      </ButtonsContainer>
    </div>
  );
};

const mapStateToProps = (state: ApplicationState) => ({
  paymentId: state.order.paymentId,
  user: state.user.details,
});

const mapDispatchToProps = (dispatch: any) => bindActionCreators({}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Invoice);
