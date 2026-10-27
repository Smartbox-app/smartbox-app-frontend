import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { order } from 'src/actions';
import { CheckBox } from 'src/components/Common';
import { __ } from 'src/helpers/i18n';
import { useTenant } from 'src/hooks/useTenant';
import { ApplicationState } from 'src/reducers';

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
        label={__('application.phrases.agreementEarlyStart', {
          name: tenant?.name ?? '',
        })}
      />
    </>
  );
};

export default ScrollPosition;
