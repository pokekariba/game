import React from 'react';
import Card from '../../components/Card';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authService } from '../../services/auth.service';
import { ResetPasswordRequest } from '../../@types/AuthServicesTypes';

const ResetPassword: React.FC = () => {
  const [senha, setSenha] = React.useState('');
  const [confirmarSenha, setConfirmarSenha] = React.useState('');
  const [mensagem, setMensagem] = React.useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';

  const handleReset = async () => {
    if (senha !== confirmarSenha) {
      alert('As senhas não coincidem');
      return;
    }
    if (!token) {
      alert('Token inválido ou expirado');
      return;
    }

    const payload: ResetPasswordRequest = { token, senha };
    try {
      const response = await authService.resetPassword(payload);
      setMensagem(response.message || 'Senha redefinida com sucesso!');
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      console.error(error);
      alert('Erro ao redefinir a senha. Tente novamente.');
    }
  };

  return (
    <div className="d-center container">
      <Card haveLogo className="d-flex gap-2 flex-column">
        <h2>Redefinir Senha</h2>

        <Input
          label="Nova senha"
          type="password"
          placeholder="Digite sua nova senha"
          value={senha}
          onChange={e => setSenha(e.target.value)}
        />
        <small className="text-muted">
          A senha deve ter no mínimo 8 caracteres e incluir pelo menos 1 número
        </small>

        <Input
          label="Confirme a nova senha"
          type="password"
          placeholder="Confirme sua nova senha"
          value={confirmarSenha}
          onChange={e => setConfirmarSenha(e.target.value)}
        />

        <Button onClick={handleReset}>
          Redefinir senha
        </Button>

        {mensagem && <p className="text-success">{mensagem}</p>}

        <Button outline onClick={() => navigate('/login')}>
          Voltar para o login
        </Button>
      </Card>
    </div>
  );
};

export default ResetPassword;