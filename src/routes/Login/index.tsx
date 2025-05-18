import React from 'react';
import Card from '../../components/Card';
import Input from '../../components/Input';
import Button from '../../components/Button';

const Login: React.FC = () => {
  return (
    <div className='d-center container'>
      <Card haveLogo className='d-flex gap-2 flex-column'>
        <Input label='Usuário' placeholder='Digite seu nome de usuário'/>
        <Input label='Senha' type='password' placeholder='Digite sua senha'/>
        <Button>
          Entrar
        </Button>
        <Button outline>
          Criar uma conta
        </Button>

      </Card>
    </div>
  );
};

export default Login;
