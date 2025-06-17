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
import { StoreService } from '../../../../services/store.service';

const Lobby: React.FC = () => {
  const navigate = useNavigate();
  const partida = useGameStore((state) => state.partidaSelecionada);
  const setSkinPartida = useGameStore((state) => state.setSkinPartida);
  const dadosPartida = useGameStore((state) => state.dadosPartida);
  const usuario = useGameStore((state) => state.usuario);
  const adversario = useGameStore((state) => state.adversario);

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
    const buscarSkins = async () => {
      if (dadosPartida) {
        const skinsPartida = {
          avatarAdversario: '/assets/ash.png',
          avatarUsuario: '/assets/ash.png',
          fundo: '/assets/bg.png',
          cartasAdversario: [
            '/assets/mock-cartas/ditto.webp',
            '/assets/mock-cartas/magnemite.webp',
            '/assets/mock-cartas/machop.webp',
            '/assets/mock-cartas/abra.webp',
            '/assets/mock-cartas/koffin.webp',
            '/assets/mock-cartas/bulbasauro.webp',
            '/assets/mock-cartas/charmander.webp',
            '/assets/mock-cartas/squirtle.webp',
            '/assets/mock-cartas/pikachu.webp',
          ],
          cartasUsuario: [
            '/assets/mock-cartas/ditto.webp',
            '/assets/mock-cartas/magnemite.webp',
            '/assets/mock-cartas/machop.webp',
            '/assets/mock-cartas/abra.webp',
            '/assets/mock-cartas/koffin.webp',
            '/assets/mock-cartas/bulbasauro.webp',
            '/assets/mock-cartas/charmander.webp',
            '/assets/mock-cartas/squirtle.webp',
            '/assets/mock-cartas/pikachu.webp',
          ],
        };
        if (usuario) {
          const skinsUsuario = await StoreService.listarImagemItens([
            usuario.baralhoAtivo,
            usuario.fundoAtivo,
          ]);
          if (usuario.baralhoAtivo && skinsUsuario[0].length) {
            skinsPartida.cartasUsuario = skinsUsuario[0];
          }
          if (usuario.fundoAtivo && skinsUsuario[1][0]) {
            skinsPartida.fundo = skinsUsuario[1][0];
          }
        }
        if (adversario) {
          const skinsAdversario = await StoreService.listarImagemItens([
            adversario.deck_ativo,
          ]);
          if (adversario.deck_ativo && skinsAdversario[0]) {
            skinsPartida.cartasAdversario = skinsAdversario[0];
          }
        }
        setSkinPartida(skinsPartida);
        setTimeout(() => {
          navigate('../play');
        }, 300);
      }
    };
    buscarSkins();
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
