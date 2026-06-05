import React from 'react';
import { Button } from 'src/components/Branded';
import { ButtonsContainer } from 'src/components/Layout';
import { __ } from 'src/helpers/i18n';
import { useRentNoteQuery } from 'src/queries';
import { useDispatch } from 'react-redux';
import { modal } from 'src/actions';
import { RentNoteEditModal } from './RentNoteEditModal';
import { Skeleton, Typography } from 'src/components/ui';

interface Props {
  rentId: string;
  canEdit: boolean;
}

export const RentNote = ({ rentId, canEdit }: Props) => {
  const dispatch = useDispatch();
  const { data, isFetching } = useRentNoteQuery(rentId);

  const handleEditModal = () => {
    dispatch(
      modal.showModal(
        <RentNoteEditModal rentId={rentId} note={data?.note || ''} />,
      ),
    );
  };

  if (isFetching) return <Skeleton height={48} />;

  return (
    <>
      <Typography>{data?.note || __('application.lack')}</Typography>
      {canEdit ? (
        <ButtonsContainer>
          <Button
            text="application.edit"
            type="button"
            primary
            click={handleEditModal}
          />
        </ButtonsContainer>
      ) : null}
    </>
  );
};
