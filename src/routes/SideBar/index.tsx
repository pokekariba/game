import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useGameStore } from '../../store/useGameStore';
import Button from '../../components/Button';
import { authService } from '../../services/auth.service';
import mock from '../../assets/img/ash.png';

const SideBar: React.FC = () => {

  const usuario = useGameStore((state) => state.usuario);
  const location = useLocation();
  const [isMenu, setIsMenu] = React.useState(false);
  const navigate = useNavigate();

  const voltar = () => {
    if (isMenu) return authService.logout();
    return navigate('/pokariba');
  };

  React.useEffect(() => {
    const path = location.pathname.split('/');
    setIsMenu(path.length <= 2);
  }
  , [location]);

  return (
    <main className='nav__container'>
      <nav className='nav'>
        <header className='d-flex flex-column align-center gap-2'>
          <img className='nav__avatar' src={mock} alt="avatar usuario" />
          <h1 className='fs-5'>{usuario?.nome ?? 'usuario'}</h1>
          <div className='nav__saldo'>
            <h2 className='fs-2'>Saldo:</h2>
            <p className='fs-4'>{usuario?.moedas}</p>
            <p className='fs-4'>moedas</p>
          </div>
        </header>
        <footer className='d-flex flex-column gap-2'>
          <Button border={false} href='/pokariba/user'>
            Dados
          </Button>
          <Button color='dark-primary' onClick={voltar}>
            {isMenu ? 'Sair' : 'Menu'}
          </Button>
        </footer>
      </nav>
      <div className='nav__content'>
        <Outlet/>
      </div>
    </main>
  );
};

export default SideBar;