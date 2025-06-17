import React from 'react';
import Card from '../../components/Card';
import '../../styles/styles.scss';

const Help: React.FC = () => {
  return (
    <div className="d-center container">
      <Card haveLogo>
        <div className="d-flex gap-2 flex-column help">
          <h2 className="fs-5">🎯 Objetivo do Jogo</h2>
          <p>
            Em Pokariba, seu objetivo é recolher o maior número de cartas ao
            longo da partida, utilizando a vantagem de tipos Pokémon para
            expulsar os adversários do campo de batalha.
          </p>

          <h2 className="fs-5">🧩 Componentes</h2>
          <p>66 cartas no total, divididas em:</p>
          <ul>
            <li>🛡️ Metal – (8)</li>
            <li>✊ Luta – (8)</li>
            <li>🧠 Psíquico – (8)</li>
            <li>🌑 Sombrio – (8)</li>
            <li>🌿 Planta – (8)</li>
            <li>🔥 Fogo – (8)</li>
            <li>💧 Água – (8)</li>
            <li>⚡ Elétrico – (8)</li>
            <li>🔄 Curinga/Sem Tipo – (2)</li>
          </ul>
          <h2 className="fs-5">👥 Jogadores</h2>
          <p>Exclusivo para 2 jogadores</p>
          <h2 className="fs-5">▶️ Como Jogar</h2>
          <p>A partida acontece em turnos alternados:</p>
          <p>
            O jogador joga 1 ou mais cartas do mesmo tipo no espaço
            correspondente do tabuleiro (exemplo: cartas de Fogo vão no espaço
            🔥 Fogo). Pode incluir curingas para completar a jogada.
          </p>
          <p>
            Se o total de cartas naquele espaço atingir 3 ou mais, esse tipo
            pode expulsar todos os tipos inferiores que estiverem no tabuleiro.
          </p>
          <ul>
            <li>
              A hierarquia segue esta ordem (do mais forte para o mais fraco):
              ⚡ Elétrico → 💧 Água → 🔥 Fogo → 🌿 Planta → 🌑 Sombrio → 🧠
              Psíquico → ✊ Luta → 🛡️ Metal
            </li>
            <li>
              Os tipos mais fortes expulsam todos os tipos abaixo deles na
              hierarquia.
            </li>
            <li>
              Exceção especial: o tipo 🛡️ Metal é o único que pode expulsar o
              tipo⚡ Elétrico.
            </li>
            <li>
              Exemplo: ao jogar 3 cartas de Planta, você expulsa Sombrio,
              Psíquico, Luta e Metal — se houver cartas nesses espaços.
            </li>
          </ul>
          <p>
            As cartas expulsas são coletadas automaticamente e somadas à
            pontuação do jogador, com um contador que mostra quantas cartas de
            cada tipo ele possui.
          </p>
          <p>
            A compra de cartas é feita automaticamente após a jogada, até
            completar a mão com 5 cartas (se houver cartas restantes no
            baralho).
          </p>
          <h2 className="fs-5">⏱️ Tempo de Jogada</h2>
          <p>Cada jogador tem até 15 segundos por turno.</p>
          <p>
            Caso jogue antes do tempo acabar, pode clicar no botão "Finalizar
            Jogada" para passar a vez.
          </p>
          <p>
            Se o tempo esgotar sem nenhuma ação, o turno é encerrado
            automaticamente.
          </p>
          <h2 className="fs-5">🃏 Carta Curinga/Sem Tipo</h2>
          <p>Pode ser jogada sozinha ou junto com qualquer outro tipo.</p>
          <p>
            Pode causar expulsão mesmo sozinha, atuando como o tipo escolhido no
            momento da jogada.
          </p>
          <p>O tipo declarado pelo jogador define qual espaço será afetado.</p>
          <h2 className="fs-5">🛑 Fim do Jogo</h2>
          <p>
            A partida é encerrada automaticamente quando não houver mais cartas
            no monte e quando todos os jogadores jogarem todas as cartas da sua
            mão.
          </p>
          <h2 className="fs-5">🏆 Condição de Vitória</h2>
          <p>O jogador com mais cartas coletadas vence.</p>
          <p>
            Em caso de empate na quantidade de cartas, o jogo declara empate
            (sem vitória compartilhada).
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Help;
