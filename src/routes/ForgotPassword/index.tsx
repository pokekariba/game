import React from 'react';
import Card from '../../components/Card';
import Input from '../../components/Input';
import Button from '../../components/Button';


const ForgotPassword: React.FC = () => {
  return (
    
    <div className='d-center container'>
      
      <Card haveLogo className='d-flex gap-2 flex-column'>
      <Input label='Usuário' placeholder='Digite seu usuário'/>
      <Input label='Email' placeholder='Digite seu e-mail vinculado ao usuário'/>
      <Button>
          Enviar email de recuperação
        </Button>
        <Button outline>
          Voltar para o login
        </Button>
    </Card>
    </div>  
  );
};

export default ForgotPassword;
