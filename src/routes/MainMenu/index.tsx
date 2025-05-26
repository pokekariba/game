import React from 'react';
import Button from '../../components/Button';
import { useNavigate } from 'react-router-dom';

const MainMenu: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className='d-center container' 
      style={{ display: 'flex', flexDirection: 'column', gap: '20px', justifyContent: 'center',
      alignItems: 'center', height: '100vh', paddingBottom: '100px' }}>

      <img src="src/assets/img/logo-pokariba.png" alt="Logo" style={{ width: '300px' }} />

      <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', alignItems: 'center' }}>
        <Button color="white" size="lg" border={false} style={{ width: '180px' }} onClick={() => navigate('\Game')}>
          Jogar
        </Button>
        <Button color="white" size="lg" border={false} style={{ width: '180px' }} onClick={() => navigate('\Store')}>
          Loja
          </Button>
        <Button color="white" size="lg" border={false} style={{ width: '180px' }} onClick={() => navigate('\Help')}>
          Regras
          </Button>
      </div>
    </div>
  );
};

export default MainMenu;