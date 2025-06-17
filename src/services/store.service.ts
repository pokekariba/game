import { ListaItensLojaResponse } from "../@types/StoreServicesTypes";
import { ItemLoja, TipoItemLoja } from "../@types/Item";
import api from "../api/axios";
import { useLojaStore } from "../store/useLojaStore";
import { useGameStore } from "../store/useGameStore";

export const StoreService = {
  listaItensLoja: async (): Promise<ListaItensLojaResponse> => {
    try {
      const response = await api.get<ListaItensLojaResponse>("/logged/loja");
      useLojaStore.getState().setLoja(response.data);
      return response.data;
    } catch (error) {
      console.error("Erro ao carregar itens da loja:", error);
      throw error;
    }
  },
  comprarItemLoja: async (itemId: number): Promise<{ saldoAtual: number }> => {
    try {
      const response = await api.post("/logged/comprar-item", { itemId });
      return response.data;
    } catch (error) {
      console.error("Erro ao comprar item:", error);
      return { saldoAtual: useGameStore.getState().usuario?.moedas || 0 };
    }
  },
  equiparItem: async (
     id: number,
     tipo: TipoItemLoja
  ): Promise<{ itemAtivo: number }|undefined > => {
    try {
      const response = await api.post("/logged/loja/", { id, tipo });
      return response.data;
    } catch (error) {
      console.error("Erro ao equipar background:", error);
      return undefined;
    }
  },
  listarImagemItens:async (itens: ItemLoja[]): Promise<string[][]> => {
    try {
      const listaImagemItens: string[][] = [];
      for (const item of itens) {
        const response = await api.post<{ urlsItem: string[] }>("/logged/visualizar-item",{ itemId: item.id });
        listaImagemItens.push(response.data.urlsItem);
      }
      return listaImagemItens;
    } catch (error) {
      console.error("Erro ao equipar background:", error);
      return [];
    }
  },
};