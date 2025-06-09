import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

const RequireAuth: React.FC = () => {
  const token = useAuthStore((state) => state.token);
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    const id = setTimeout(() => setReady(true), 0);
    return () => clearTimeout(id);
  }, []);

  if (!ready) return null;

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
export default RequireAuth;
