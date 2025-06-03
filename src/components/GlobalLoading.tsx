import React from 'react';
import { useLoadingStore } from '../store/useLoading';
import Loading from '../assets/img/loading.gif';

export const GlobalLoading: React.FC = () => {
  const loading = useLoadingStore((s) => s.loading);

  if (!loading) return null;

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="global-loading__overlay"
    >
      <img src={Loading} className="global-loading__gif" />
    </div>
  );
};
