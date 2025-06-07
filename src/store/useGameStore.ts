import { create } from 'zustand';
import { Usuario } from '../@types/Usuario';
import { Partida, PartidaSelecionada } from '../@types/Partida';
import DadosPartida from '../@types/DadosPartida';
import Resultado from '../@types/Resultado';
import { SkinPatida } from '../@types/SkinPartida';

export interface GameState {
  usuario?: Usuario;
  listaPartidas?: Partida[];
  dadosPartida?: DadosPartida;
  skinPartida?: SkinPatida;
  partidaSelecionada?: PartidaSelecionada;
  resultado?: Resultado;
  setUsuario: (usuario?: Usuario) => void;
  setListaPartidas: (listaPartidas?: Partida[]) => void;
  setDadosPartida: (dadosPartida?: DadosPartida) => void;
  selecionarPartida: (partida?: PartidaSelecionada) => void;
  setResultado: (resultado?: Resultado) => void;
  setSkinPartida: (skinPartida?: SkinPatida) => void;
}

export const useGameStore = create<GameState>((set) => ({
  usuario: undefined,
  listaPartidas: undefined,
  dadosPartida: undefined,
  partidaSelecionada: undefined,
  skinPartida: {
    avatarAdversario: '/assets/ash.png',
    avatarUsuario: '/assets/ash.png',
    fundo: '/assets/bg.png',
    cartasAdversario: [
      '/assets/mock-cartas/ditto.webp',
      '/assets/mock-cartas/magnemite.webp',
      '/assets/mock-cartas/machop.webp',
      '/assets/mock-cartas/abra.webp',
      '/assets/mock-cartas/koffin.webp',
      '/assets/mock-cartas/bulbasauro.webp',
      '/assets/mock-cartas/charmander.webp',
      '/assets/mock-cartas/squirtle.webp',
      '/assets/mock-cartas/pikachu.webp',
    ],
    cartasUsuario: [
      '/assets/mock-cartas/ditto.webp',
      '/assets/mock-cartas/magnemite.webp',
      '/assets/mock-cartas/machop.webp',
      '/assets/mock-cartas/abra.webp',
      '/assets/mock-cartas/koffin.webp',
      '/assets/mock-cartas/bulbasauro.webp',
      '/assets/mock-cartas/charmander.webp',
      '/assets/mock-cartas/squirtle.webp',
      '/assets/mock-cartas/pikachu.webp',
    ],
  },
  resultado: undefined,
  setUsuario: (usuario) => {
    set({ usuario });
    usuario
      ? sessionStorage.setItem('usuario', JSON.stringify(usuario))
      : sessionStorage.removeItem('usuario');
  },
  setListaPartidas: (listaPartidas) => set({ listaPartidas }),
  setDadosPartida: (dadosPartida) => set({ dadosPartida }),
  selecionarPartida: (partidaSelecionada) => set({ partidaSelecionada }),
  setResultado: (resultado) => set({ resultado }),
  setSkinPartida: (skinPartida) => set({ skinPartida }),
}));

const usuarioStr = sessionStorage.getItem('usuario');

if (usuarioStr) {
  useGameStore.setState({
    usuario: usuarioStr ? JSON.parse(usuarioStr) : undefined,
  });
}
