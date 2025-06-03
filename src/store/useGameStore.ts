import { create } from 'zustand';
import { Usuario } from '../@types/Usuario';
import { Partida, PartidaSelecionada } from '../@types/Partida';
import DadosPartida from '../@types/DadosPartida';
import Jogador from '../@types/Jogadores';
import Resultado from '../@types/Resultado';

interface GameState {
  usuario?: Usuario;
  listaPartidas?: Partida[];
  dadosPartida?: DadosPartida;
  partidaSelecionada?: PartidaSelecionada;
  resultado?: Resultado;
  setUsuario: (usuario?: Usuario) => void;
  setListaPartidas: (listaPartidas?: Partida[]) => void;
  setDadosPartida: (dadosPartida?: DadosPartida) => void;
  selecionarPartida: (partida?: PartidaSelecionada) => void;
  setResultado: (resultado?: Resultado) => void;
}

export const useGameStore = create<GameState>((set) => ({
  usuario: undefined,
  listaPartidas: undefined,
  dadosPartida: undefined,
  partidaSelecionada: undefined,
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
}));

const usuarioStr = sessionStorage.getItem('usuario');

if (usuarioStr) {
  useGameStore.setState({
    usuario: usuarioStr ? JSON.parse(usuarioStr) : undefined,
  });
}
