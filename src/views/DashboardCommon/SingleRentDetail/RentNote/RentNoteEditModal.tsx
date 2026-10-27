import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { modal } from 'src/actions';
import { Button } from 'src/components/Branded';
import Input from 'src/components/Common/Input';
import { ButtonsContainer } from 'src/components/Layout';
import { Modal } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';
import { useSetRentNoteMutation } from 'src/mutations';

interface Props {
  rentId: string;
  note: string;
}

export const RentNoteEditModal = ({ rentId, note }: Props) => {
  const dispatch = useDispatch();
  const { mutate, isPending, isSuccess } = useSetRentNoteMutation(rentId);
  const [draft, setDraft] = useState(note);

  useEffect(() => {
    setDraft(note);
  }, [note]);

  useEffect(() => {
    if (!isSuccess) return;

    dispatch(modal.hideModal());
  }, [dispatch, isSuccess]);

  return (
    <>
      <Modal.Header title={__('application.note')} />
      <Modal.Content>
        <Input
          type="textarea"
          input={{
            label: 'application.note',
            name: `rent-note-${rentId}`,
            value: draft,
            onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setDraft(e.target.value),
            placeholder: __('application.notePlaceholder'),
            errors: [],
          }}
        />

        <ButtonsContainer>
          <Button
            text="application.cancel"
            type="button"
            disabled={isPending}
            click={() => dispatch(modal.hideModal())}
          />
          <Button
            text="application.save"
            type="button"
            primary
            disabled={isPending}
            click={() => mutate(draft)}
          />
        </ButtonsContainer>
      </Modal.Content>
    </>
  );
};
