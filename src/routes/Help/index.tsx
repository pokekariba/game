// import React from 'react';
// import "../../styles/styles.scss";
// import SideBar from '../SideBar';

// const Help: React.FC = () => {
//   return (
//     <div style={{ display: 'flex', height: '100vh' }}>
//       <div style={{ width: '250px', flexShrink: 0 }}>
//         <SideBar />
//       </div>

//       <div className='d-center container'  
//         style={{ display: 'flex', flexGrow: 1, justifyContent: 'center', alignItems: 'center', height: '100vh' }}>

//         <div style={{ width: 'calc(100vw - 250px)', display: 'flex', justifyContent: 'center' }}>
//           <img src="/assets/cartao_de_regra.png" alt="Cartão de regra" 
//             style={{ maxWidth: "100%", height: "auto", margin: "0 auto" }} />
//         </div>

//       </div>
//     </div>
//   );
// };

// export default Help;

import React from 'react';
import Button from '../../components/Button';
import Card from '../../components/Card';
import '../../styles/styles.scss';
import SideBar from '../SideBar';
import { useNavigate } from 'react-router-dom';

const Help: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div>
      <div style={{ position: 'absolute', left: 0, top: 0, width: '250px', height: '100vh' }}>
        <SideBar />
      </div>

      <div className='d-center container' style={{ marginLeft: '250px' }}> 
        <Card haveLogo className="d-flex gap-2 flex-column" style={{ width: "800px", padding: "16px" }}>
          <h1 style={{ fontWeight: "bold", fontSize: "2rem" }}>DECK</h1>
          <p>
            O deck de jogo tem 66 cartas. Essas cartas são divididas em 9 tipos:
            elétrico, água, fogo, planta, sombrio, psíquico, lutador, aço e sem tipo.
            Cada um tem 8 cartas, menos o sem tipo, que tem apenas 2.
          </p>
          <h1 style={{ fontWeight: "bold", fontSize: "2rem" }}>Como Jogar</h1>
          <p>
            Cada jogador tem 5 cartas em mãos, variando entre tipos. 
            Durante o seu turno, o jogador deve colocar pelo menos 2 cartas em casas de tipo correspondente e,
            ao final da rodada, comprará cartas até que sua mão esteja cheia novamente.
            Sempre que uma carta for colocada numa casa que já tem 2 ou mais cartas, 
            remova todas as cartas na casa mais próxima no sentido horário. 
            Cada carta removida no seu turno vale 1 ponto. 
            Ganha quem tiver mais pontos quando acabarem as cartas no deck.
            Cartas sem tipo podem ser jogadas em qualquer casa.
          </p>
          <div>
            <Button onClick={() => navigate('/main-menu')}>
              Voltar ao menu principal
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Help;