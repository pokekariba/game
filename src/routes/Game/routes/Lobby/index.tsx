import React from 'react';
import ash from '../../../../assets/img/ash.png';
import { useNavigate } from 'react-router-dom';
import {
  SocketClientEventsEnum,
  SocketServerEventsEnum,
} from '../../../../@types/PartidaServiceTypes';
import Button from '../../../../components/Button';
import Card from '../../../../components/Card';
import { emitirEvento } from '../../../../services/partida.service';
import { useGameStore } from '../../../../store/useGameStore';

const Lobby: React.FC = () => {
  const navigate = useNavigate();
  const partida = useGameStore((state) => state.partidaSelecionada);
  const dadosPartida = useGameStore((state) => state.dadosPartida);

  const sairPartida = async () => {
    if (partida) {
      await emitirEvento(
        SocketClientEventsEnum.SAIR_PARTIDA,
        SocketServerEventsEnum.LISTAR_PARTIDAS,
        true,
        {
          idPartida: partida.id,
        },
      );
      navigate('../lobby-list');
    }
  };

  const iniciarPartida = async () => {
    if (!partida) return;
    await emitirEvento(
      SocketClientEventsEnum.INICIAR_PARTIDA,
      SocketServerEventsEnum.RODADA_CALCULADA,
      true,
      {
        idPartida: partida.id,
      },
    );
  };

  React.useEffect(() => {
    if (dadosPartida) {
      navigate('../play');
    }
  }, [dadosPartida]);

  return (
    <div className="d-center flex-column container">
      <h1 className="game__page-title text-border">Batalha {partida?.nome}</h1>
      <h2 className="fs-3 text-white mb-5 text-border">
        A batalha vai começar em instantes!
      </h2>
      <Card className="game__lobby__container">
        <ul className="game__lobby">
          {partida?.jogadores?.map((jogador) => (
            <li className="game__lobby__item">
              <img
                className="game__lobby__avatar"
                src={ash}
                alt="imagem jogaor 01"
              />
              <h3>{jogador.nome}</h3>
              <p>
                Partidas Ganhas {jogador.partidas_ganhas}/
                {jogador.partidas_totais}
              </p>
            </li>
          ))}
        </ul>
        {partida?.donoPartida && (
          <Button className="mt-5" onClick={iniciarPartida}>
            Iniciar Batalha
          </Button>
        )}
        <Button color="error" outline className="mt-5" onClick={sairPartida}>
          Sair da Batalha
        </Button>
      </Card>
    </div>
  );
};

export default Lobby;
