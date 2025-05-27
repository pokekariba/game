import React from 'react';
import Button from '../../components/Button';
import { useNavigate } from 'react-router-dom';
import SideBar from '../SideBar';
import logo from '../../assets/img/logo-pokariba.png';

const MainMenu: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: '250px', height: '100vh' }}>
        <SideBar />
      </div>

      <div className='d-center container'  
        style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          flexGrow: 1, 
          height: '100vh', 
          gap: '30px',
          marginLeft: '250px'
        }}>

        <img src={logo} alt="Logo" style={{ width: '300px', display: 'block' }} />

        <div style={{ 
          display: 'flex', 
          flexDirection: 'row', 
          gap: '20px', 
          alignItems: 'center', 
          justifyContent: 'center', 
          width: '100%' 
        }}>
          <Button color="white" style={{ width: '180px' }} onClick={() => navigate('/game')}>
            Jogar
          </Button>
          <Button color="white" style={{ width: '180px' }} onClick={() => navigate('/store')}>
            Loja
          </Button>
          <Button color="white" style={{ width: '180px' }} onClick={() => navigate('/help')}>
            Regras
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MainMenu;