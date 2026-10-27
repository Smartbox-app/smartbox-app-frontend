import React from 'react';

import { Modal } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';
import { Form } from 'src/views/DashboardCommon/StockGroups/Stocks/Manage/Discounts/GiftModal/Form';

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
