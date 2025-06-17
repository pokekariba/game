import axios from 'axios';
import env from '../config/env';
import { useAuthStore } from '../store/useAuthStore';
import { useLoadingStore } from '../store/useLoading';
import { useModal } from '../store/useModal';

const api = axios.create({
  baseURL: env.SERVER_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  },
);

api.interceptors.request.use(
  (config) => {
    useLoadingStore.getState().increment();
    return config;
  },
  (error) => {
    useLoadingStore.getState().decrement();
    abrirModal(error?.message);
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => {
    useLoadingStore.getState().decrement();
    return response;
  },
  (error) => {
    useLoadingStore.getState().decrement();
    abrirModal(error.response.data.mensagem || error.message);
    return Promise.reject(error);
  },
);

const abrirModal = (error: string) => {
  useModal.getState().setModalContent(error);
  useModal.getState().setModal(true);
};

export default api;
