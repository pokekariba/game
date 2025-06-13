import { create } from 'zustand';

interface LoadingStore {
  loading: boolean;
  setLoading: (value: boolean) => void;
  increment: () => void;
  decrement: () => void;
  activeRequests: number;
}

export const useLoadingStore = create<LoadingStore>((set, get) => ({
  loading: false,
  activeRequests: 0,
  setLoading: (value) => set({ loading: value }),
  increment: () => {
    const active = get().activeRequests + 1;
    set({ activeRequests: active, loading: true });
  },
  decrement: () => {
    const active = Math.max(get().activeRequests - 1, 0);
    set({ activeRequests: active, loading: active > 0 });
  },
}));
