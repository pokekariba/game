import { ListaItensLojaResponse } from '../@types/StoreServicesTypes';
import { ItemLoja } from '../@types/Item';
import api from '../api/axios';
import { useLojaStore } from '../store/useLojaStore';
import { useGameStore } from '../store/useGameStore';

export const StoreService = {
  listaItensLoja: async (): Promise<ListaItensLojaResponse> => {
    try {
      const response = await api.get<ListaItensLojaResponse>('/logged/loja');
      useLojaStore.getState().setLoja(response.data);
      return response.data;
    } catch (error) {
      console.error('Erro ao carregar itens da loja:', error);
      throw error;
    }
  },
  comprarItemLoja: async (itemId: number): Promise<{ saldoAtual: number }> => {
    try {
      const response = await api.post('/logged/comprar-item', { itemId });
      return response.data;
    } catch (error) {
      console.error('Erro ao comprar item:', error);
      return { saldoAtual: useGameStore.getState().usuario?.moedas || 0 };
    }
  },
  equiparItem: async (
    idItem: number,
    variante?: number,
  ): Promise<{ itemAtivo: number } | undefined> => {
    try {
      const response = await api.post('/logged/selecionar-item', {
        idItem,
        variante,
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao equipar background:', error);
      return undefined;
    }
  },
  listarImagemItens: async (
    itens: ItemLoja[] | number[],
  ): Promise<string[][]> => {
    try {
      const listaImagemItens: string[][] = [];
      for (const item of itens) {
        const itemId = typeof item === 'number' ? item : item.id;
        const response = await api.post<{ urlsItem: string[] }>(
          '/logged/visualizar-item',
          { itemId },
        );
        listaImagemItens.push(response.data.urlsItem);
      }
      return listaImagemItens;
    } catch (error) {
      console.error('Erro ao equipar background:', error);
      return [];
    }
  },
  comprarMoedas: async (quantidade: number): Promise<number> => {
    try {
      const response = await api.post<{ moedasAtuais: number }>(
        '/logged/comprar-moedas',
        { quantidade },
      );
      const usuario = useGameStore.getState().usuario;
      if (usuario) {
        useGameStore
          .getState()
          .setUsuario({ ...usuario, moedas: response.data.moedasAtuais });
      }
      return response.data.moedasAtuais;
    } catch (error) {
      console.error('Erro ao equipar background:', error);
      return 0;
    }
  },
};
