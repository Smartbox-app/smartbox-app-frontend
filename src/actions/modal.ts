import React from 'react';

import type { AppDispatch } from 'src/types/app-dispatch';

export const showModal = (content: React.ReactNode, isClosable = true, isFullscreen = false) => (dispatch: AppDispatch) => {
  dispatch({
    type: 'PREPARE_MODAL',
    payload: { content, isClosable, isFullscreen },
  });
  setTimeout(() => {
    dispatch({
      type: 'SHOW_MODAL',
      payload: { content, isClosable, isFullscreen },
    });
  }, 100);
};

export const hideModal = () => (dispatch: AppDispatch) => {
  dispatch({ type: 'HIDE_MODAL' });
  setTimeout(() => {
    dispatch({ type: 'UNPREPARE_MODAL' });
  }, 300);
};
