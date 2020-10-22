import React from 'react';
import { FormHeader } from '../../../../components/Layout';
import { __ } from '../../../../helpers/i18n';

import Form from './Form';

const DiscountCodes = () => (
  <>
    <FormHeader title={__('application.generateGiftCode')} />
    <Form />
  </>
);

export default DiscountCodes;
