import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Spinner } from 'src/components/Branded';
import Input from 'src/components/Common/Input';
import { ButtonsContainer } from 'src/components/Layout';
import { Modal } from 'src/components/ui';
import { modal } from 'src/actions';
import { __ } from 'src/helpers/i18n';
import { useSetUserNoteMutation } from 'src/mutations';
import { useUserNoteQuery } from 'src/queries';

interface Props {
  userId: string;
}

export const UserNoteEditModal = ({ userId }: Props) => {
  const dispatch = useDispatch();
  const { data, isFetching } = useUserNoteQuery(userId);
  const { mutate, isPending, isSuccess } = useSetUserNoteMutation(userId);

  const [draft, setDraft] = useState(data?.note || '');

  useEffect(() => {
    setDraft(data?.note || '');
  }, [data?.note]);

  useEffect(() => {
    if (!isSuccess) return;

    dispatch(modal.hideModal());
  }, [dispatch, isSuccess]);

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDraft(e.target.value);
  };

  const handleSave = () => {
    mutate(draft);
  };

  const handleCancel = () => {
    dispatch(modal.hideModal());
  };

  return (
    <>
      <Modal.Header title={__('application.userNote')} />
      <Modal.Content>
        {isFetching ? <Spinner halfTransparent overlay /> : null}
        <Input
          type="textarea"
          input={{
            label: 'application.userNote',
            name: `user-note-${userId}`,
            value: draft,
            onChange: handleNoteChange,
            placeholder: __('application.userNotePlaceholder'),
            errors: [],
          }}
        />
      </Modal.Content>
      <Modal.Actions>
        <ButtonsContainer>
          <Button
            text="application.cancel"
            type="button"
            disabled={isPending}
            click={handleCancel}
          />
          <Button
            text="application.save"
            type="button"
            primary
            disabled={isPending}
            click={handleSave}
          />
        </ButtonsContainer>
      </Modal.Actions>
    </>
  );
};
