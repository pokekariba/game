import {create} from 'zustand';
import { Usuario } from '../@types/Usuario';

interface GameState {
  usuario?: Usuario;
  isGameOver: boolean;
  setUsuario: (usuario: Usuario) => void;
  setGameOver: (isGameOver: boolean) => void;
}

export const useGameStore = create<GameState>((set) => ({
  usuario: undefined,
  isGameOver: false,
  setUsuario: (usuario) => set({ usuario }),
  setGameOver: (isGameOver) => set({ isGameOver }),
}));
