import React from 'react';
import Button from '../../components/Button';
import Card from '../../components/Card';
import { useGameStore } from '../../store/useGameStore';
import { authService } from '../../services/auth.service';

const InfoUser: React.FC = () => {
  const usuario = useGameStore((state) => state.usuario);

  return (
    <div className="d-center container">
      <Card haveLogo className="d-flex gap-1 flex-column">
        <h1 className="text-center fs-3 mb-2">Dados do usuário</h1>
        <div className="d-flex flex-row justify-between">
          <p>Nome do usuário: </p>
          <p>{usuario?.nome}</p>
        </div>
        <div className="d-flex flex-row justify-between">
          <p>Email do usuário: </p>
          <p>{usuario?.nome}</p>
        </div>
        <div className="d-flex flex-row justify-between">
          <p>Partidas ganhas: </p>
          <p>{usuario?.partidasGanhas}</p>
        </div>
        <div className="d-flex flex-row justify-between">
          <p>Partidas jogadas: </p>
          <p>{usuario?.partidasTotais}</p>
        </div>
        <div className="d-flex flex-row justify-between">
          <p>Criação da conta: </p>
          <p>{usuario?.dataCriacao}</p>
        </div>
        <Button color="error" outline onClick={authService.logout}>
          Desconectar
        </Button>
      </Card>
    </div>
  );
};

export default InfoUser;
