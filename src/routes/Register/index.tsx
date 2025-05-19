import React from 'react';
import Card from '../../components/Card';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/auth.service';

const Register: React.FC = () => {
  const [usuario, setUsuario] = React.useState('');
  const [senha, setSenha] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [confirmarSenha, setConfirmarSenha] = React.useState('');
  const navigate = useNavigate();
  
  const handleRegister = async () => {
    if (senha !== confirmarSenha) {
      alert('As senhas não coincidem');
      return;
    }
    const registrado = await authService.register({ usuario, senha, email });
    if(registrado){
      navigate('/login');
    }
  }



  return (
    <div className='d-center container'>
      
      <Card haveLogo className='d-flex gap-2 flex-column'>
        <Input label='Usuário' 
        placeholder='Digite seu usuário'
        value={usuario}
        onChange={e => setUsuario(e.target.value)}
        />
        <Input label='Email' 
        placeholder='Digite seu e-mail'
        value={email}
        onChange={e => setEmail(e.target.value)}/>
        <Input label='Senha' 
        type='password' 
        placeholder='Digite sua senha'
        value={senha}
        onChange={e => setSenha(e.target.value)}/>
        <small className='text-muted'>A senha deve ter 8 caracteres e 1 número</small>
        <Input label='Confirme sua senha' 
        type='password' 
        placeholder='Digite sua senha'
        value={confirmarSenha}
        onChange={e => setConfirmarSenha(e.target.value)}
        />
        <Button onClick={handleRegister}>
          Criar conta
        </Button>
        <Button outline href='/login'>
          Voltar para o login
        </Button>
      </Card>
    </div>  
  );
};

export default Register;
