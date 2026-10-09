import React, { useState } from 'react';
import { Button } from 'src/components/Branded';
import { fetchRentFileDownloadUrl } from 'src/queries/useGetRentFileUrlQuery';
import { openSignedDownloadUrl } from 'src/utils/signed-download-url';

type Props = {
  rentId: string;
  fileName: string;
};

export const RentAttachedFileButton = ({ rentId, fileName }: Props) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);

    try {
      const data = await fetchRentFileDownloadUrl(rentId, fileName);
      if (!data?.url) return;

      await openSignedDownloadUrl(data);
    } catch(e) {
      console.error('ERROR FETCHING ATTACHED FILE', e);
    }
    finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      small
      blank
      primary
      click={() => void handleClick()}
      disabled={isLoading}
      text="application.seeAttachedFile"
    />
  );
};
