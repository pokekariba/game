import React from 'react';
import Button from '../../components/Button';
import Card from '../../components/Card';
import { useNavigate } from 'react-router-dom';
import SideBar from '../SideBar';

const InfoUser: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div>
      <div style={{ position: 'absolute', left: 0, top: 0, width: '250px', height: '100vh' }}>
        <SideBar />
      </div>

      <div className='d-center container' style={{ marginLeft: '250px' }}>
        <Card haveLogo className="d-flex gap-2 flex-column">
          <h1 style={{ fontWeight: "bold", fontSize: "2rem", textAlign: "center" }}>Dados do usuário</h1>
          <h2>Nome do usuário: </h2>
          <h2>Email do usuário: </h2>
          <h2>Senha: </h2>
          <h2>Criação da conta: </h2>
          
          <div>
            <Button onClick={() => navigate('/login')}>
              Desconectar
          </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default InfoUser;