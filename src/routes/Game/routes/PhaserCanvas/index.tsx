import React from 'react';
import StartGame from '../../../../game/main';
import { useGameStore } from '../../../../store/useGameStore';
import JogadorInfo from './components/JogadorInfo';
import Placar from './components/Placar';
import Button from '../../../../components/Button';
import Menu from '../../../../assets/svg/icons/menu.svg?react';
import Modal from '../../../../components/Modal';
import { TipoTabuleiro } from '../../../../@types/game/TipoTabuleiroEnum';
import { emitirEvento } from '../../../../services/partida.service';
import { SocketClientEventsEnum } from '../../../../@types/PartidaServiceTypes';
import { useNavigate } from 'react-router-dom';
import { Battle } from '../../../../game/scenes/Battle';

const PhaserCanvas: React.FC = () => {
  const gameRef = React.useRef<Phaser.Game | null>(null);
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const dadosPartida = useGameStore((state) => state.dadosPartida);
  const usuario = useGameStore((state) => state.usuario);
  const resultado = useGameStore((state) => state.resultado);
  const skinPartida = useGameStore((state) => state.skinPartida);
  const adversario = useGameStore((state) => state.adversario);
  const partida = useGameStore((state) => state.partidaSelecionada);
  const [tabuleiroAtivo, setTabuleiroAtivo] = React.useState(
    TipoTabuleiro.TABULEIRO,
  );
  const [menu, setMenu] = React.useState(false);
  const [suaVez, setSuaVez] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    window.addEventListener('sua_vez', onSuaVez);
    console.log({
      dadosPartida,
      usuario,
      skinPartida,
      adversario,
    });
    if (containerRef.current && !gameRef.current) {
      gameRef.current = StartGame(containerRef.current);
    }
    return () => {
      const scene = gameRef.current?.scene.getScene('Battle') as Battle;
      scene?.shutdown?.();
      gameRef.current?.destroy(true);
      gameRef.current = null;
      window.removeEventListener('sua_vez', onSuaVez);
    };
  }, []);

  const onSuaVez = (event: Event) => {
    const vez = (event as CustomEvent).detail;
    setSuaVez(vez);
  };

  React.useEffect(() => {
    if (suaVez !== undefined && resultado) {
      navigate('../game-over');
    }
  }, [suaVez, resultado]);

  const desistirPartida = () => {
    if (!partida) return;
    emitirEvento(SocketClientEventsEnum.DESISTIR_PARTIDA, null, false, {
      idPartida: partida.id,
    });
  };

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
    dadosPartida &&
    usuario &&
    skinPartida &&
    adversario && (
      <div className="phaser-ui__background">
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
          <Placar
            inverter
            pontuacao={dadosPartida.cartasCapturadasAdversario}
          />

          <Button disabled={!suaVez} onClick={finalizarRodada}>
            Finalizar jogada
          </Button>
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
      </div>
    )
  );
};

export default PhaserCanvas;
