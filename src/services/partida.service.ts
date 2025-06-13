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
import { useModal } from '../store/useModal';

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
    const modalsState = useModal.getState();
    modalsState.setModalContent(err.message);
    useLoadingStore.getState().setLoading(false);
    modalsState.setModal(true);
    const modalObserver = useModal.subscribe((modal) => {
      if (!modal.modal) {
        window.location.href = '/pokariba';
        modalObserver();
      }
    });
  });

  socket.on(SocketServerEventsEnum.TOKEN_RENOVADO, (token) => {
    useAuthStore.getState().setToken(token);
  });

  socket.on(SocketServerEventsEnum.LISTAR_PARTIDAS, (data) => {
    useGameStore.getState().setListaPartidas(data.partidas);
  });

  socket.on(SocketServerEventsEnum.ERRO_PARTIDA, (data) => {
    const modalsState = useModal.getState();
    modalsState.setModalContent(data.message);
    useLoadingStore.getState().setLoading(false);
    modalsState.setModal(true);
  });

  socket.on(SocketServerEventsEnum.SALA_ATUALIZADA, (data) => {
    if (data.jogadores.length > 1) {
      const adversario = data.jogadores.find(
        (jogador) => jogador.nome !== useGameStore.getState().usuario?.nome,
      );
      useGameStore.getState().setAdversario(adversario);
    }
    useGameStore.getState().selecionarPartida(data);
  });

  socket.on(SocketServerEventsEnum.RODADA_CALCULADA, (data) => {
    useGameStore.getState().setDadosPartida(data);
  });

  socket.on(SocketServerEventsEnum.FINAL_PARTIDA, (data) => {
    useGameStore
      .getState()
      .setResultado({ ...data, pontuacaoMap: new Map(data.pontuacao) });
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
