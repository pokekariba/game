import React from 'react';
import Card from '../../components/Card';
import '../../styles/styles.scss';
import tabuleiroImg from '../../assets/svg/tabuleiro-explicacao.svg';

const Help: React.FC = () => {
  return (
    <div className="d-center container" style={{ marginLeft: '250px' }}>
      <Card haveLogo className="d-flex gap-2 flex-column help">
        <h1 className="fs-5">DECK</h1>
        <p>
          O deck de jogo tem 66 cartas. Essas cartas são divididas em 9 tipos:
          elétrico, água, fogo, planta, sombrio, psíquico, lutador, aço e sem
          tipo. Cada um tem 8 cartas, menos o sem tipo, que tem apenas 2.
        </p>
        <h1 className="fs-5">Como Jogar</h1>
        <div className="d-flex">
          <p>
            Cada jogador tem 5 cartas em mãos, variando entre tipos. Durante o
            seu turno, o jogador deve colocar pelo menos 2 cartas em casas de
            tipo correspondente e, ao final da rodada, comprará cartas até que
            sua mão esteja cheia novamente. Sempre que uma carta for colocada
            numa casa que já tem 2 ou mais cartas, remova todas as cartas na
            casa mais próxima no sentido horário. Cada carta removida no seu
            turno vale 1 ponto. Ganha quem tiver mais pontos quando acabarem as
            cartas no deck. Cartas sem tipo podem ser jogadas em qualquer casa.
          </p>
          <img
            src={tabuleiroImg}
            alt="tabuleiro Imgagem"
            className="help__tabuleiro"
          />
        </div>
      </Card>
    </div>
  );
};

export default Help;
