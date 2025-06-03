import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import ArrowLeft from '../../assets/svg/icons/arrow-left.svg?react';
import Button from '../../components/Button';
import {
  conectarSocket,
  desconectarSocket,
} from '../../services/partida.service';

const Game: React.FC = () => {
  const navigate = useNavigate();

  React.useEffect(() => {
    conectarSocket();
    return desconectarSocket;
  }, []);

  const voltarHome = () => {
    desconectarSocket();
    navigate('/pokariba');
  };

  return (
    <>
      <Button iconButton className="game__icon" onClick={voltarHome}>
        <ArrowLeft />
      </Button>
      <Outlet />
    </>
  );
};

export default Game;
