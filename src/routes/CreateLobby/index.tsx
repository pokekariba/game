import React from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { emitirEvento } from '../../services/partida.service';
import { SocketClientEventsEnum } from '../../@types/PartidaServiceTypes';
import { useGameStore } from '../../store/useGameStore';
import { useNavigate } from 'react-router-dom';

const CreateLobby: React.FC = () => {
  const [nomePartida, setNomePartida] = React.useState('');
  const [senhaPartida, setSenhaPartida] = React.useState('');
  const partidaSelecionada = useGameStore((e) => e.partidaSelecionada);
  const navigate = useNavigate();

  const criarSala = () => {
    if (!nomePartida) return;
    emitirEvento(SocketClientEventsEnum.CRIAR_PARTIDA, {
      nome: nomePartida,
      senha: senhaPartida,
    });
  };

  React.useEffect(() => {
    if (partidaSelecionada) {
      navigate('../lobby');
    }
  }, [partidaSelecionada]);

  return (
    <div className="d-center flex-column container">
      <h1 className="game__page-title text-border">Criador de Batalhas</h1>
      <h2 className="fs-3 text-white mb-5 text-border">
        Crie sua uma arena Pokariba
      </h2>
      <Card className="game__create-lobby">
        <Input
          label="Nome da arena:"
          placeholder="Arena 001"
          value={nomePartida}
          onChange={(e) => setNomePartida(e.target.value)}
        />
        <Input
          label="Senha da arena (não obrigatório):"
          placeholder="senha@123"
          type="password"
          value={senhaPartida}
          onChange={(e) => setSenhaPartida(e.target.value)}
        />
        <Button className="mt-5" onClick={criarSala}>
          Criar Sala
        </Button>
        <Button href="../lobby-list" outline>
          Voltar para lista
        </Button>
      </Card>
    </div>
  );
};

export default CreateLobby;
