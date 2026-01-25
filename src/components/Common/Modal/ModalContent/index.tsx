import React from 'react';
import './ModalContent.scss';

interface Props {
  children: React.ReactNode;
}

const ModalContent = ({ children }: Props) => {
  return (
    <div className="modal-content">
      {children}
    </div>
  );
};

export default ModalContent;
