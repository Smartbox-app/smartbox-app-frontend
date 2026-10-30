import React from 'react';

import { Modal } from 'src/types/modal';

interface ModalPayload {
    content: React.ReactNode;
    isClosable: boolean;
    isFullscreen: boolean;
}

interface ShowModal {
    type: 'SHOW_MODAL';
    payload: ModalPayload;
}

interface HideModal {
    type: 'HIDE_MODAL';
}

interface PrepareModal {
    type: 'PREPARE_MODAL';
}

interface UnprepareModal {
    type: 'UNPREPARE_MODAL';
}

type Action = ShowModal | HideModal | PrepareModal | UnprepareModal;

const initialState: Modal = {
    isVisible: false,
    isClosable: true,
    isPrepared: false,
    isUnprepared: false,
    isFullscreen: false,
    content: null,
};

export default (state = initialState, action: Action) => {
    switch (action.type) {
        case 'PREPARE_MODAL':
            return { ...state, isPrepared: true, content: null };
        case 'UNPREPARE_MODAL':
            return { ...state, isPrepared: false };
        case 'SHOW_MODAL':
            document.querySelector('#root')?.classList.add('noscroll');
            return {
                ...state,
                isVisible: true,
                content: action.payload.content,
                isClosable: action.payload.isClosable,
                isFullscreen: action.payload.isFullscreen,
            };
        case 'HIDE_MODAL':
            document.querySelector('#root')?.classList.remove('noscroll');
            return {
                ...state,
                isVisible: false,
                isClosable: true,
                isPrepared: true,
            };
        default:
            return state;
    }
};
