import { useDispatch } from 'react-redux';

import { hideModal } from 'src/actions/modal';
import { Button, Modal } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';

export const CannotDeleteAddonModal = () => {
  const dispatch = useDispatch();

  return (
    <>
      <Modal.Header title={__('application.cannotDeleteAddon')} />
      <Modal.Content>
        <p>{__('application.cannotDeleteAddonUsedByOpenEnded')}</p>
      </Modal.Content>
      <Modal.Actions>
        <Button
          text="application.understood"
          onClick={() => dispatch(hideModal())}
        />
      </Modal.Actions>
    </>
  );
};
