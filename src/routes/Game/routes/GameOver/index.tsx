import React from 'react';
import Card from '../../../../components/Card';
import { useGameStore } from '../../../../store/useGameStore';
import { MotivoFinal } from '../../../../@types/Resultado';

const GameOver: React.FC = () => {
  const usuario = useGameStore((state) => state.usuario);
  const setUsuario = useGameStore((state) => state.setUsuario);
  const resultado = useGameStore((state) => state.resultado);
  const skinPartida = useGameStore((state) => state.skinPartida);
  const adversario = useGameStore((state) => state.adversario);
  const zerarPartida = useGameStore((state) => state.zerarPartida);
  const [titulo, setTitulo] = React.useState('');

  React.useEffect(() => {
    if (resultado && usuario) {
      usuario.partidasTotais++;
      let tituloMontado = '';
      switch (resultado.vencedor) {
        case usuario.nome:
          usuario.partidasGanhas++;
          tituloMontado = 'Vitória';
          break;
        case 'Empate':
          tituloMontado = 'Empate';
          break;
        default:
          tituloMontado = 'Derrota';
          break;
      }
      setUsuario({ ...usuario });
      if (resultado.motivo === MotivoFinal.DESISTENCIA) {
        tituloMontado += ' (Desistência)';
      }
      setTitulo(tituloMontado);
    }
    return zerarPartida;
  }, []);

  return (
    usuario &&
    adversario && (
      <div className="d-center flex-column gap-5">
        <Card className={`game-over__result game-over__result--${titulo}`}>
          <h1>{titulo}</h1>
        </Card>
        <div className="d-flex gap-5 align-center">
          <img src={skinPartida?.avatarUsuario} className="phaser-ui__avatar" />
          <div className="phaser-ui__avatar__container game-over__nome">
            <p>{usuario.nome}</p>
          </div>
          <Card className="game-over__score">
            <h2>
              {resultado?.pontuacaoMap.get(usuario.nome) +
                ' X ' +
                resultado?.pontuacaoMap.get(adversario.nome)}
            </h2>
          </Card>
          <div className="phaser-ui__avatar__container game-over__nome">
            <p>{adversario.nome}</p>
          </div>
          <img
            src={skinPartida?.avatarAdversario}
            className="phaser-ui__avatar"
          />
        </div>
      </div>
    )
  );
};

export default GameOver;
