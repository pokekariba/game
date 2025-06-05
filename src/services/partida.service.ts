import { io, Socket } from 'socket.io-client';
import {
  ClientEvents,
  ServerEvents,
  SocketServerEventsEnum,
} from '../@types/PartidaServiceTypes';
import { useAuthStore } from '../store/useAuthStore';
import env from '../config/env';
import { useGameStore } from '../store/useGameStore';
import { useLoadingStore } from '../store/useLoading';

let socket: Socket<ServerEvents, ClientEvents> | null = null;

export const conectarSocket = () => {
  if (socket) desconectarSocket();
  adicionarLoading();
  const token = useAuthStore.getState().token;

  socket = io(env.SERVER_URL, {
    path: '/jogo',
    auth: { token },
    transports: ['websocket'],
  });

  socket.on('connect', () => {
    console.log('[Socket] Conectado:', socket?.id);
    removerLoading();
  });

  socket.on('disconnect', (reason) => {
    console.log('[Socket] Desconectado:', reason);
  });

  socket.on('connect_error', (err) => {
    console.error('[Socket] Erro de conexão:', err.message);
  });

  socket.on(SocketServerEventsEnum.TOKEN_RENOVADO, (token) => {
    useAuthStore.getState().setToken(token);
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

export const emitirEvento = async <Event extends keyof ClientEvents>(
  event: Event,
  responseEvent: SocketServerEventsEnum | null,
  loadingUntil: boolean,
  ...data: Parameters<ClientEvents[Event]>
): Promise<void> => {
  if (!socket) throw new Error('Socket não conectado');

  if (loadingUntil) adicionarLoading();

  try {
    socket.emit(event, ...data);
    if (responseEvent) {
      await esperarPelaResposta(responseEvent);
    }
  } finally {
    if (loadingUntil) removerLoading();
  }
};

const adicionarLoading = (): void => {
  useLoadingStore.getState().increment();
};

const removerLoading = (): void => {
  useLoadingStore.getState().decrement();
};

const esperarPelaResposta = (
  responseEvent: SocketServerEventsEnum,
  timeoutMs = 10000,
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const onResponse = () => {
      clearTimeout(timeout);
      socket?.off(responseEvent, onResponse);
      resolve();
    };

    const timeout = setTimeout(() => {
      socket?.off(responseEvent, onResponse);
      reject(new Error(`Timeout esperando evento ${responseEvent}`));
    }, timeoutMs);

    socket!.on(responseEvent, onResponse);
  });
};

export const estaConectado = () => {
  return !!socket?.connected;
};

export const desconectarSocket = () => {
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
  }
};
