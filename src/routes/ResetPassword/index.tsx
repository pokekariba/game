import React from 'react';
import Card from '../../components/Card';
import Input from '../../components/Input';
import Button from '../../components/Button';

const ResetPassword: React.FC = () => {
  return (

    <div className='d-center container'>
      <Card haveLogo className='d-flex gap-2 flex-column'>
      <Input label='Senha' type='password' placeholder='Digite sua senha'/>
      <Input label='Senha' type='password' placeholder='Confirme sua senha'/>
      <Button outline>
          Enviar email de recuperação
        </Button>
    </Card>
    </div>  
   
  );
};

export default ResetPassword;
