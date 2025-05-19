import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

const RootRedirect: React.FC = () => {
  const navigate = useNavigate();
  const token = useAuthStore((s) => s.token);

  useEffect(() => {
    if (token) {
      navigate('/pokariba', { replace: true });
    } else {
      navigate('/login', { replace: true });
    }
  }, [token, navigate]);

  return null;
};

export default RootRedirect;
