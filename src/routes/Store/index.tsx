import React from 'react';
import Button from '../../components/Button';
import logo from '../../assets/img/logo-pokariba.png';
import { useLocation, useNavigate } from 'react-router-dom';
import mock1 from "../../assets/img/Inicial/pikachu.png";
import mock2 from "../../assets/img/Inicial/charmander.png";
import mock3 from "../../assets/img/Inicial/bulbasauro.png";
import header from "../../assets/img/headerdecks.svg";

const Store: React.FC = () => {
  const location = useLocation();
  const [pagAberta,setPagAberta] = React.useState("");
  React.useEffect(() =>{
    const path = location.pathname.split('/')[3];
    setPagAberta(path);
  }, [location])

  return (
  <div className='d-flex flex-row'>
    <div className="d-flex flex-column gap-4 store__btn__container">
      <img className='logo' src={logo} alt="Logo" />

      <h1 className='fs-5 text-white mx-auto'>Loja</h1>

      <Button 
      border={false} color={pagAberta==="deck"?"primary":"white"} 
      href='deck'>
          Decks
        </Button>

        <Button 
         border={false} color={pagAberta==="background"?"primary":"white"} 
         href='background'>
          Fundo
        </Button>

        <Button 
        border={false} color={pagAberta==="avatar"?"primary":"white"} 
        href='avatar'>
          Avatar
        </Button>

        <Button 
        border={false} color='gold' onClick={() => {}}>
          Comprar Moedas
        </Button>
    </div>
    {/* menu */}
    
    <img src={header} alt='header'/>
    <div className='d-flex align-center flex-column'>
      <h1 className='fs-5 text-white'
      >Inicial</h1>
      
      <Button>
        Selecionado
      </Button>
      
      <div className='store__card__thumb'>
        <img src={mock3} alt='cartas-deck'/> 
        <img src={mock2} alt='cartas-deck'/> 
        <img src={mock1} alt='cartas-deck'/> 
      </div>
      
    </div>
    {/* pokedex */}

  </div>

  );
};

export default Store;