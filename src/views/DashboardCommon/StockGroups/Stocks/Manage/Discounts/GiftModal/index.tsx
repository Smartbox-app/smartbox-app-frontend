import React from 'react';
import { __ } from '../../../../../../../helpers/i18n';
import { Modal } from 'src/components/ui';

import { Form } from './Form';

interface Props {
  stockId: string;
}

const GiftModal = ({ stockId }: Props) => (
  <>
    <Modal.Header title={__('application.generateGiftCode')} />
    <Modal.Content>
      <Form stockId={stockId} />
    </Modal.Content>
  </>
);

export { GiftModal };
