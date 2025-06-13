import React from 'react';
import Card from '../../../../components/Card';
import Button from '../../../../components/Button';
import { useGameStore } from '../../../../store/useGameStore';
import { emitirEvento } from '../../../../services/partida.service';
import {
  SocketClientEventsEnum,
  SocketServerEventsEnum,
} from '../../../../@types/PartidaServiceTypes';
import Lock from '../../../../assets/svg/icons/lock.svg?react';
import { useNavigate } from 'react-router-dom';
import Modal from '../../../../components/Modal';
import Input from '../../../../components/Input';

const LobbyList: React.FC = () => {
  const navigate = useNavigate();
  const listaPartidas = useGameStore((state) => state.listaPartidas);
  const [senhaModal, setSenhaModal] = React.useState(false);
  const [senha, setSenha] = React.useState('');
  const [partidaId, setPartidaId] = React.useState<number | undefined>();

  const entrarSala = async (idPartida: number, temSenha: boolean) => {
    if (!temSenha) {
      await emitirEvento(
        SocketClientEventsEnum.ENTRAR_PARTIDA,
        SocketServerEventsEnum.SALA_ATUALIZADA,
        true,
        { idPartida },
      );
      return navigate('../lobby');
    }
    setSenhaModal(true);
    setPartidaId(idPartida);
  };

  const entraSalaSenha = async () => {
    if (!partidaId) return;
    await emitirEvento(
      SocketClientEventsEnum.ENTRAR_PARTIDA,
      SocketServerEventsEnum.SALA_ATUALIZADA,
      true,
      {
        idPartida: partidaId,
        senha,
      },
    );
    return navigate('../lobby');
  };

  const fecharModal = () => {
    setSenhaModal(false);
    setPartidaId(undefined);
  };

  return (
    <div className="d-center flex-column container">
      <h1 className="game__page-title text-border">Lista de Batalhas</h1>
      <h2 className="fs-3 text-white mb-5 text-border">
        Junte-se à uma arena Pokariba
      </h2>
      <Card className="game__lobby-list__container">
        <ul className="game__lobby-list">
          {listaPartidas ? (
            listaPartidas.map((partida) => (
              <li
                className="game__lobby-list__item"
                onClick={() => entrarSala(partida.id, partida.senha)}
              >
                <h3>
                  {partida.id}# {partida.nome}
                </h3>
                <div>
                  <p>vagas: {partida.vagas}</p>
                  {partida.senha && <Lock />}
                </div>
              </li>
            ))
          ) : (
            <p>Não existem arenas abertas.</p>
          )}
        </ul>
        <Button className="mt-5" href="../create-lobby">
          Criar Sala
        </Button>
      </Card>
      <p className="text-white text-border">
        Clique no nome da batalha para entrar
      </p>
      <Modal isOpen={senhaModal} onClose={fecharModal}>
        <div className="d-flex flex-column gap-4">
          <Input
            label="Senha"
            type="password"
            placeholder="Digite a senha da batalha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
          <Button onClick={entraSalaSenha}>Entrar na batalha</Button>
        </div>
      </Modal>
    </div>
  );
};

export default LobbyList;
