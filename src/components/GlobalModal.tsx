import React from 'react';
import { useModal } from '../store/useModal';
import Modal from './Modal';

export const GlobalModal: React.FC = () => {
  const modal = useModal((m) => m);

  return (
    <Modal isOpen={modal.modal} onClose={() => modal.setModal(false)}>
      {modal.content}
    </Modal>
  );
};
