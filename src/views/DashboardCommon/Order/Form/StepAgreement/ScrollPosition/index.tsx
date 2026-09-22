import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ApplicationState } from '../../../../../../reducers';
import { order } from '../../../../../../actions';
import { CheckBox } from '../../../../../../components/Common';
import { useTenant } from 'src/hooks/useTenant';

const ScrollPosition = () => {
  const dispatch = useDispatch();
  const isResignationMarked = useSelector(
    (state: ApplicationState) => state.order.isResignationMarked,
  );
  const { tenant } = useTenant();

  return (
    <>
      <CheckBox
        name="resignation"
        checked={isResignationMarked}
        handleChange={() => dispatch(order.formResignationMarked())}
        label={`Akceptuję warunki Umowy i zgadzam się na rozpoczęcie świadczenia usług ${tenant?.name} przed upływem terminu do odstąpienia od Umowy`}
      />
    </>
  );
};

export default ScrollPosition;
