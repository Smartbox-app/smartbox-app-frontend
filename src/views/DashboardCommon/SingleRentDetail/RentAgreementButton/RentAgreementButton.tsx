import { Capacitor } from '@capacitor/core';
import React from 'react';
import { useDispatch } from 'react-redux';

import { showModal } from 'src/actions/modal';
import { RentAgreementModal } from 'src/components/Common/RentAgreementModal';
import { Button } from 'src/components/ui';
import { Templates } from 'src/icons';
import ApiService from 'src/services/api-service';
import { handleFileOpen } from 'src/utils/handle-file-open';

type RentAgreementButtonProps = {
  rentId: string;
  periodIndex: number;
  documentId?: string | null;
  agreement?: string;
  small?: boolean;
};

export const RentAgreementButton = ({
  rentId,
  periodIndex,
  documentId,
  agreement,
}: RentAgreementButtonProps) => {
  const dispatch = useDispatch();

  const openLegacyAgreement = async () => {
    const path = `rent/agreement/${rentId}/${periodIndex}`;

    if (Capacitor.isNativePlatform()) {
      await handleFileOpen(path, agreement);
      return;
    }

    window.open(
      `${ApiService.url}${path}`,
      '_blank',
      'noopener,noreferrer',
    );
  };

  const handleClick = () => {
    if (documentId) {
      dispatch(
        showModal(
          <RentAgreementModal rentId={rentId} periodIndex={periodIndex} />,
        ),
      );
      return;
    }

    if (agreement) {
      void openLegacyAgreement();
    }
  };

  return (
    <Button
      variant="secondary"
      text="application.seeRentAgreement"
      onClick={handleClick}
      iconLeft={<Templates />}
    />
  );
};
