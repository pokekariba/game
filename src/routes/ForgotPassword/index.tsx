import React from 'react';
import Card from '../../components/Card';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/auth.service';
import { EsqueciSenhaRequest } from '../../@types/AuthServicesTypes';

const ForgotPassword: React.FC = () => {
  const [usuario, setUsuario] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [mensagem, setMensagem] = React.useState('');
  const navigate = useNavigate();

  const handleEsqueciSenha = async () => {
    if (!usuario || !email) {
      alert('Preencha todos os campos');
      return;
    }

    const payload: EsqueciSenhaRequest = { usuario, email };
    try {
      const response = await authService.esqueciSenha(payload);
      setMensagem(response.message);
    } catch (err) {
      console.error(err);
      alert('Erro ao solicitar recuperação de senha.');
    }
  };

  return (
    <div className='d-center container'>
      <Card haveLogo className='d-flex gap-2 flex-column'>

        <Input
          label='Usuário'
          placeholder='Digite seu usuário'
          value={usuario}
          onChange={e => setUsuario(e.target.value)}
        />

        <Input
          label='Email'
          placeholder='Digite seu e-mail'
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <Button onClick={handleEsqueciSenha}>
          Enviar email de recuperação
        </Button>

        {mensagem && <p className='text-success'>{mensagem}</p>}

        <Button outline onClick={() => navigate('/login')}>
          Voltar para o login
        </Button>
      </Card>
    </div>
  );
};

export default ForgotPassword;