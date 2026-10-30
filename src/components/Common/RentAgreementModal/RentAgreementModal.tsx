import React from 'react';

import { AgreementPreview } from 'src/components/AgreementPreview';
import { Modal } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';

type RentAgreementModalProps = {
  rentId: string;
  periodIndex: number;
};

export const RentAgreementModal = ({
  rentId,
  periodIndex,
}: RentAgreementModalProps) => (
  <>
    <Modal.Header title={__('application.rentAgreement')} />
    <Modal.Content>
      <AgreementPreview
        source="rent"
        rentId={rentId}
        periodIndex={periodIndex}
      />
    </Modal.Content>
  </>
);
