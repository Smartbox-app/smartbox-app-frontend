import React from 'react';
import { useGetEndRentPhotoUrlQuery } from 'src/queries/useGetEndRentPhotoUrlQuery';
import { Spinner } from 'src/components/Branded';
import { __ } from 'src/helpers/i18n';

type Props = {
  rentId: string;
};

export const EndRentPhoto = ({ rentId }: Props) => {
  const { displayUrl, isLoading, isError } = useGetEndRentPhotoUrlQuery(rentId);

  if (isLoading) {
    return <Spinner />;
  }

  if (isError || !displayUrl) return null;

  return (
    <a href={displayUrl} target="_blank" rel="noreferrer">
      <img src={displayUrl} alt={__('application.endRentPhoto')} />
    </a>
  );
};
