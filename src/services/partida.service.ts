import { io, Socket } from 'socket.io-client';
import {
  ClientEvents,
  ServerEvents,
  SocketServerEventsEnum,
} from '../@types/PartidaServiceTypes';
import { useAuthStore } from '../store/useAuthStore';
import env from '../config/env';
import { useGameStore } from '../store/useGameStore';

let socket: Socket<ServerEvents, ClientEvents> | null = null;

export const conectarSocket = () => {
  if (socket && socket.connected) return;

  const token = useAuthStore.getState().token;

  socket = io(env.SERVER_URL, {
    path: '/jogo',
    auth: { token },
    transports: ['websocket'],
  });

  socket.on('connect', () => {
    console.log('[Socket] Conectado:', socket?.id);
  });

  socket.on('disconnect', (reason) => {
    console.log('[Socket] Desconectado:', reason);
  });

  socket.on('connect_error', (err) => {
    console.error('[Socket] Erro de conexão:', err.message);
  });

  socket.on(SocketServerEventsEnum.LISTAR_PARTIDAS, (data) => {
    useGameStore.getState().setListaPartidas(data.partidas);
  });

  socket.on(SocketServerEventsEnum.SALA_ATUALIZADA, (data) => {
    useGameStore.getState().selecionarPartida(data);
  });

  socket.on(SocketServerEventsEnum.RODADA_CALCULADA, (data) => {
    useGameStore.getState().setDadosPartida(data);
  });

  socket.on(SocketServerEventsEnum.FINAL_PARTIDA, (data) => {
    useGameStore.getState().setResultado(data);
  });
};

export const emitirEvento = <Event extends keyof ClientEvents>(
  event: Event,
  ...args: Parameters<ClientEvents[Event]>
) => {
  socket?.emit(event, ...args);
};

export const estaConectado = () => {
  return !!socket?.connected;
};

export const desconectarSocket = () => {
  socket?.disconnect();
  socket = null;
};
