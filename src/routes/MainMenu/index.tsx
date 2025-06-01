import React from 'react';
import Button from '../../components/Button';
import logo from '../../assets/img/logo-pokariba.png';

const MainMenu: React.FC = () => {
  return (
    <div className="d-center container flex-column gap-5">
      <img src={logo} alt="Logo" className="mainmenu__logo" />

      <div className="d-flex gap-3 mainmenu__buttons">
        <Button color="white" href="/pokariba/game/lobby-list">
          Jogar
        </Button>
        <Button color="white" href="/pokariba/store/deck">
          Loja
        </Button>
        <Button color="white" href="/pokariba/help">
          Regras
        </Button>
      </div>
    </div>
  );
};

export default MainMenu;
