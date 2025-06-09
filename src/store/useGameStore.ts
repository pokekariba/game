import { create } from 'zustand';
import { Usuario } from '../@types/Usuario';
import { Partida, PartidaSelecionada } from '../@types/Partida';
import DadosPartida from '../@types/DadosPartida';
import Resultado from '../@types/Resultado';
import { SkinPatida } from '../@types/SkinPartida';
import { TipoCarta } from '../@types/Carta';
import Jogador from '../@types/Jogadores';

export interface GameState {
  usuario?: Usuario;
  listaPartidas?: Partida[];
  dadosPartida?: DadosPartida;
  skinPartida?: SkinPatida;
  partidaSelecionada?: PartidaSelecionada;
  resultado?: Resultado;
  adversario: Jogador;
  setAdversario: (jogador?: Jogador) => void;
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
  dadosPartida: {
    baralho: 66,
    cartasCapturadas: Array(9).fill(0),
    cartasCapturadasAdversario: Array(9).fill(0),
    maoAdversario: 5,
    maoJogador: [
      {
        id: 1,
        partida_id: 1,
        posicao: 0,
        jogador_partida_id: 1,
        tipo: TipoCarta.mao,
        valor: 1,
      },
      {
        id: 2,
        partida_id: 2,
        posicao: 1,
        jogador_partida_id: 1,
        tipo: TipoCarta.mao,
        valor: 2,
      },
      {
        id: 3,
        partida_id: 3,
        posicao: 2,
        jogador_partida_id: 1,
        tipo: TipoCarta.mao,
        valor: 3,
      },
      {
        id: 4,
        partida_id: 4,
        posicao: 3,
        jogador_partida_id: 1,
        tipo: TipoCarta.mao,
        valor: 4,
      },
      {
        id: 5,
        partida_id: 5,
        posicao: 4,
        jogador_partida_id: 1,
        tipo: TipoCarta.mao,
        valor: 0,
      },
    ],
    pontuacaoJogador: 0,
    pontuacaoAdversario: 0,
    rodada: 1,
    suaVez: true,
    tabuleiro: [],
  },
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
  adversario: {
    avatar_ativo: 1,
    nome: 'seidi',
    partidas_ganhas: 0,
    partidas_totais: 0,
  },
  setAdversario: (adversario) => set({ adversario }),
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
