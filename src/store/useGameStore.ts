import {create} from 'zustand';
import { Usuario } from '../@types/Usuario';

interface GameState {
  usuario?: Usuario;
  isGameOver: boolean;
  setUsuario: (usuario?: Usuario) => void;
  setGameOver: (isGameOver: boolean) => void;
}

export const useGameStore = create<GameState>((set) => ({
  usuario: undefined,
  isGameOver: false,
  setUsuario: (usuario) => {
    set({ usuario });
    if (usuario) {
      sessionStorage.setItem('usuario', JSON.stringify(usuario));
    } else {
      sessionStorage.removeItem('usuario');
    }
  },
  setGameOver: (isGameOver) => {
    set({ isGameOver });
    sessionStorage.setItem('isGameOver', JSON.stringify(isGameOver));
  },
}));

const usuarioStr = sessionStorage.getItem('usuario');
const isGameOverStr = sessionStorage.getItem('isGameOver');
if (usuarioStr || isGameOverStr) {
  useGameStore.setState({
    usuario: usuarioStr ? JSON.parse(usuarioStr) : undefined,
    isGameOver: isGameOverStr ? JSON.parse(isGameOverStr) : false,
  });
}
