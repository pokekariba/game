import DadosPartida from './DadosPartida';
import Jogador from './Jogadores';
import { Partida } from './Partida';
import Resultado from './Resultado';

export enum SocketClientEventsEnum {
  JOGADA = 'jogada',
  DESISTIR_PARTIDA = 'desistir_partida',
  ENTRAR_PARTIDA = 'entrar_partida',
  SAIR_PARTIDA = 'sair_partida',
  CRIAR_PARTIDA = 'criar_partida',
  INICIAR_PARTIDA = 'iniciar_partida',
}

export enum SocketServerEventsEnum {
  LISTAR_PARTIDAS = 'listar_partidas',
  RODADA_CALCULADA = 'rodada_calculada',
  FINAL_PARTIDA = 'final_partida',
  SALA_ATUALIZADA = 'sala_atualizada',
  TOKEN_RENOVADO = 'token_renovado',
}

export interface SocketServerEventsData {
  [SocketServerEventsEnum.LISTAR_PARTIDAS]: {
    partidas: Partida[];
  };
  [SocketServerEventsEnum.RODADA_CALCULADA]: DadosPartida;
  [SocketServerEventsEnum.FINAL_PARTIDA]: Resultado;
  [SocketServerEventsEnum.SALA_ATUALIZADA]: Partida & {
    donoPartida: boolean;
    jogadores: Jogador[];
  };
  [SocketServerEventsEnum.TOKEN_RENOVADO]: string;
}

export interface SocketClientEventsData {
  [SocketClientEventsEnum.JOGADA]: {
    idCartas: number[];
    idPartida: number;
    valorCamaleao?: number;
  };
  [SocketClientEventsEnum.DESISTIR_PARTIDA]: {
    idPartida: number;
  };
  [SocketClientEventsEnum.ENTRAR_PARTIDA]: {
    idPartida: number;
    senha?: string;
  };
  [SocketClientEventsEnum.SAIR_PARTIDA]: {
    idPartida: number;
  };
  [SocketClientEventsEnum.CRIAR_PARTIDA]: {
    nome: string;
    senha?: string;
  };
  [SocketClientEventsEnum.INICIAR_PARTIDA]: {
    idPartida: number;
  };
}

export type ServerEvents = {
  [K in SocketServerEventsEnum]: (data: SocketServerEventsData[K]) => void;
};

export type ClientEvents = {
  [K in SocketClientEventsEnum]: (data: SocketClientEventsData[K]) => void;
};
