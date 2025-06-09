import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import ArrowLeft from '../../assets/svg/icons/arrow-left.svg?react';
import Button from '../../components/Button';
import {
  conectarSocket,
  desconectarSocket,
} from '../../services/partida.service';

const Game: React.FC = () => {
  const navigate = useNavigate();
  const loc = useLocation();
  const [botaoVoltar, setBotaoVoltar] = useState(false);

  React.useEffect(() => {
    // conectarSocket();
    return desconectarSocket;
  }, []);

  React.useEffect(() => {
    setBotaoVoltar(!loc.pathname.includes('play'));
  }, [loc.pathname]);

  const voltarHome = () => {
    desconectarSocket();
    navigate('/pokariba');
  };

  return (
    <>
      {botaoVoltar && (
        <Button iconButton className="game__icon" onClick={voltarHome}>
          <ArrowLeft />
        </Button>
      )}
      <Outlet />
    </>
  );
};

export default Game;
