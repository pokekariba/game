import { create } from 'zustand';
import { ListaItensLojaResponse } from '../@types/StoreServicesTypes';
import { ItemLoja } from '../@types/Item';

interface LojaState extends ListaItensLojaResponse {
  setLoja: (lista: ListaItensLojaResponse) => void;
  updateItem: (itemAtualizado: ItemLoja) => void;
}

export const useLojaStore = create<LojaState>((set) => ({
  cartas: [] as ItemLoja[],
  fundo: [] as ItemLoja[],
  avatar: [] as ItemLoja[],

  setLoja: (lista) => {
    set(lista);
  },

  updateItem: (itemAtualizado) => {
    set((state) => {
      // Atualiza o item na lista correta, seja cartas, fundo ou avatar
      const atualizarLista = (lista: ItemLoja[]) =>
        lista.map(item => item.id === itemAtualizado.id ? itemAtualizado : item);

      switch (itemAtualizado.tipo) {
        case 'deck':
          return { cartas: atualizarLista(state.cartas) };
        case 'fundo':
          return { fundo: atualizarLista(state.fundo) };
        case 'avatar':
          return { avatar: atualizarLista(state.avatar) };
        default:
          return {};
      }
    });
  },
}));