import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { withRouter } from 'react-router-dom';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button, Input } from '../../../../../components/Common';
import { order } from '../../../../../actions';
import { ButtonsContainer, Section } from '../../../../../components/Layout';
import { history } from '../../../../../App';
import { Form } from '../../../../../reducers/order-reducer';

import './StepSummary.scss';
import FormHeader from '../../../../../components/Layout/FormHeader';
import { formatPrice } from '../../../../../utils/format-price';

interface Props {
  history: any;
  formData: Form;
  countedPrice: number;
  UpdateFormData: (data: any) => void;
  FormGoNextStep: (data: number) => void;
}

const StepSummary = ({ formData, countedPrice, UpdateFormData, FormGoNextStep }: Props) => {
  useEffect(() => {
    if (formData.size.length === 0) {
      history.push('/admin/order/step/1');
    }
  });

  const [date, setDate] = useState(new Date());

  const defaultValues = {
    dateStart: date,
    dateEnd: date,
  };

  const { register, handleSubmit, watch, errors, control } = useForm({ defaultValues });

  const onSubmit = (data: any) => {
    UpdateFormData(data);
    FormGoNextStep(4);
    history.push('/admin/order/step/4');
  };

  const onBack = () => {
    FormGoNextStep(2);
    history.push('/admin/order/step/2');
  };

  const desktop = window.matchMedia('(min-width: 920px)').matches;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form-step-two">
      <FormHeader title="Podsumowanie zamówienia:" />
      <div className="order-summary-wrapper">
        <div className="row">
          Termin rozpoczęcia wynajmu: <span>{formData.dateStart.toLocaleDateString()}</span>
        </div>
        <div className="row">
          Termin rozpoczęcia wynajmu: <span>{formData.dateEnd.toLocaleDateString()}</span>
        </div>
        <div className="row">
          {console.log('formatPrice(countedPrice)', countedPrice)}
          {console.log('formatPrice(countedPrice)', formatPrice(countedPrice))}
          Opłata za wynajem: <span>{formatPrice(countedPrice)}</span>
        </div>

        {desktop && (
          <object className="rules-embed" data="/assets/dummy_pdf.pdf" type="application/pdf">
            Regulamin serwisu
          </object>
        )}
        {!desktop && <h2>Przeczytaj i zaakceptuj regulamin</h2>}
      </div>

      <ButtonsContainer max>
        <Button outline text="Wróć" click={() => onBack()} />
        <Button type="submit" primary text="Przejdz do płatności" />
      </ButtonsContainer>
    </form>
  );
};

const mapStateToProps = (state: any) => ({
  formData: state.order.formData,
  countedPrice: state.order.countedPrice,
});

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      ...order,
    },
    dispatch,
  );

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(StepSummary));
