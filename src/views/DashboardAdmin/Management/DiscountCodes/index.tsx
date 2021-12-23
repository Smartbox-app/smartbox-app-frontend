import React from 'react';
import {FormContainer, FormHeader} from '../../../../components/Layout';
import { __ } from '../../../../helpers/i18n';

import Form from './Form';

const DiscountCodes = () => (
    <FormContainer>
        <FormHeader title={__('application.generateGiftCode')}/>
        <Form/>
    </FormContainer>
);

export default DiscountCodes;
