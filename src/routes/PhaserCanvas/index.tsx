import React from 'react';
import StartGame from '../../game/main';
import { useGameStore } from '../../store/useGameStore';
import JogadorInfo from './components/JogadorInfo';
import Placar from './components/Placar';
import Button from '../../components/Button';
import Menu from '../../assets/svg/icons/menu.svg?react';
import Modal from '../../components/Modal';
import { TipoTabuleiro } from '../../@types/game/TipoTabuleiroEnum';

const PhaserCanvas: React.FC = () => {
  const gameRef = React.useRef<Phaser.Game | null>(null);
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const dadosPartida = useGameStore().dadosPartida!;
  const usuario = useGameStore().usuario!;
  const skinPartida = useGameStore().skinPartida!;
  const adversario = useGameStore().adversario!;
  const [tabuleiroAtivo, setTabuleiroAtivo] = React.useState(
    TipoTabuleiro.TABULEIRO,
  );
  const [menu, setMenu] = React.useState(false);
  const [suaVez, setSuaVez] = React.useState(false);

  React.useEffect(() => {
    window.addEventListener('sua_vez', (event) => {
      const vez = (event as CustomEvent).detail;
      setSuaVez(vez);
    });
    if (containerRef.current && !gameRef.current) {
      gameRef.current = StartGame(containerRef.current);
    }

    return () => {
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, []);

  const desistirPartida = () => {};

  const trocarTabuleiro = (novoTipoTabuleiro: TipoTabuleiro) => {
    const event = new CustomEvent('trocar_tabuleiro', {
      detail: novoTipoTabuleiro,
    });
    setTabuleiroAtivo(novoTipoTabuleiro);
    window.dispatchEvent(event);
  };

  const finalizarRodada = () => {
    const event = new CustomEvent('finalizar_rodada');
    window.dispatchEvent(event);
  };

  return (
    <>
      <div className="phaser-ui phaser-ui__left">
        <div className="d-flex align-center">
          <Button iconButton onClick={() => setMenu(true)}>
            <Menu className="phaser-ui__menu" />
          </Button>
          <div className="phaser-ui__indicador-cartas">
            Cartas Restantes: {dadosPartida.baralho}
          </div>
        </div>
        <Placar pontuacao={dadosPartida.cartasCapturadas} />
        <JogadorInfo
          nome={usuario.nome}
          avatar={skinPartida.avatarUsuario}
          pontos={dadosPartida.pontuacaoJogador}
        />
      </div>
      <div className="phaser-ui phaser-ui__right">
        <JogadorInfo
          nome={adversario.nome}
          avatar={skinPartida.avatarAdversario}
          pontos={dadosPartida.pontuacaoAdversario}
          inverter
        />
        <Placar inverter pontuacao={dadosPartida.cartasCapturadasAdversario} />
        {suaVez && <Button onClick={finalizarRodada}>Finalizar jogada</Button>}
      </div>
      <div ref={containerRef}></div>
      <Modal isOpen={menu} onClose={() => setMenu(false)}>
        <div className="d-flex flex-column gap-4">
          <h2>Menu de Batalha</h2>
          <Button
            color="primary"
            outline={tabuleiroAtivo === TipoTabuleiro.TABULEIRO_SIMPLES}
            onClick={() => trocarTabuleiro(TipoTabuleiro.TABULEIRO)}
          >
            Tabuleiro Completo
          </Button>
          <Button
            color="primary"
            outline={tabuleiroAtivo === TipoTabuleiro.TABULEIRO}
            onClick={() => trocarTabuleiro(TipoTabuleiro.TABULEIRO_SIMPLES)}
          >
            Tabuleiro Simples
          </Button>
          <Button color="error" onClick={desistirPartida}>
            Desistir
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default PhaserCanvas;
