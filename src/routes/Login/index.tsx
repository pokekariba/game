import React from 'react';
import Card from '../../components/Card';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { authService } from '../../services/auth.service';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [usuario, setUsuario] = React.useState('');
  const [senha, setSenha] = React.useState('');
  const navigate = useNavigate();
  
  const handleLogin = async () => {
    const logado = await authService.login({ usuario , senha });
    if (logado) {
      navigate('/pokariba');
    }
  };

  return (
    <div className='d-center container'>
      <Card haveLogo className='d-flex gap-2 flex-column'>
        <Input label='Usuário' 
        placeholder='Digite seu nome de usuário' 
        value={usuario}
        onChange={e => setUsuario(e.target.value)}/>

        <Input label='Senha' 
        type='password' 
        placeholder='Digite sua senha'
        value={senha}
        onChange={e => setSenha(e.target.value)}/>
        
        <Button onClick={handleLogin}>
          Entrar
        </Button>
        <Button outline
        href='/register'>
          Criar uma conta
        </Button>

      </Card>
    </div>
  );
};

export default Login;
