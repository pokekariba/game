import React from 'react';
import { create } from 'zustand';

interface Modal {
  modal: boolean;
  content: React.ReactNode;
  setModal: (value: boolean) => void;
  setModalContent: (content: React.ReactNode) => void;
}

export const useModal = create<Modal>((set) => ({
  modal: false,
  content: undefined,
  setModal: (modal) => {
    set({ modal });
  },
  setModalContent: (content) => set({ content }),
}));
