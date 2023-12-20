import React from 'react';
import { FormContainer, FormHeader } from '../../../../../../../components/Layout';

import { Form } from './Form';

interface Props {
    stockId: string;
}

const GiftModal = ({ stockId }: Props) => (
    <FormContainer>
        <FormHeader title="application.generateGiftCode" />
        <Form stockId={stockId} />
    </FormContainer>
);

export { GiftModal };
