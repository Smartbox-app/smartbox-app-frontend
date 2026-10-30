import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import {
  errorNotificationText,
  successNotification,
} from 'src/actions/notifications';
import { Button } from 'src/components/Branded';
import { ButtonsContainer } from 'src/components/Layout';
import ApiService from 'src/services/api-service';

interface Props {
  id: string;
  disabled?: boolean;
}

export const OpenBox = ({ id, disabled = false }: Props) => {
  const [isOpening, setIsOpening] = useState(false);
  const dispatch = useDispatch();
  const openBox = async () => {
    if (disabled) return;
    setIsOpening(true);
    await ApiService.callFetch(
      'GET',
      `box/open/${id}`,
      (isSuccess: boolean) => {
        if (isSuccess) {
          dispatch(successNotification('application.boxOpenedSuccessfully'));
        } else {
          dispatch(errorNotificationText('application.cannotOpenBox'));
        }
      },
    );
    setIsOpening(false);
  };

  return (
    <ButtonsContainer left>
      <Button
        primary
        disabled={disabled || isOpening}
        text="application.openBox"
        click={openBox}
      />
    </ButtonsContainer>
  );
};
