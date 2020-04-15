import React from 'react';

export const showModal = (content: React.ReactNode, isClosable = true, isFullscreen = false) => (dispatch: any) => {
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

export const hideModal = () => (dispatch: any) => {
  dispatch({ type: 'HIDE_MODAL' });
  setTimeout(() => {
    dispatch({ type: 'UNPREPARE_MODAL' });
  }, 300);
};
