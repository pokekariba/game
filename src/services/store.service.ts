import { ListaItensLojaResponse } from "../@types/StoreServicesTypes";
import api from "../api/axios";
import { useLojaStore } from "../store/useLojaStore";

export const StoreService = {
  listaItensLoja: async (): Promise<ListaItensLojaResponse> => {
    try {
      const response = await api.get<ListaItensLojaResponse>('/loja');
      useLojaStore.getState().setLoja(response.data);
      return response.data;
    } catch (error) {
      console.error("Erro ao carregar itens da loja:", error);
      throw error;
    }
  },

  comprarItemLoja: async (id: number): Promise<{ sucesso: boolean }> => {
    try {
      const response = await api.post('/loja/comprar', { id });
      return response.data;
    } catch (error) {
      console.error("Erro ao comprar item:", error);
      return { sucesso: false };
    }
  },

  equiparBackground: async (params: { id: number; tipo: "menu" | "batalha" }): Promise<{ sucesso: boolean }> => {
    try {
      const response = await api.post('/loja/equipar', params);
      return response.data;
    } catch (error) {
      console.error("Erro ao equipar background:", error);
      return { sucesso: false };
    }
  }
};