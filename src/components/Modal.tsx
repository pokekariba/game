import React, { ReactNode } from 'react';
import Card from './Card';
import Close from '../assets/svg/icons/close.svg?react';
import Button from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  return isOpen ? (
    <div className="modal__overlay">
      <Card className="modal">
        <Button className="modal__button" iconButton onClick={onClose}>
          <Close />
        </Button>
        <div>{children}</div>
      </Card>
    </div>
  ) : null;
};

export default Modal;
