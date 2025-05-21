import { Usuario } from "./Usuario";

export interface RequestLogin{
    usuario: string;
    senha: string;
}

export interface ResponseLogin extends Usuario{
    
}

export interface ResquestRegister{
    usuario: string;
    senha: string;
    email: string;
}

export interface EsqueciSenhaRequest {
  usuario: string;
  email: string;
}
export interface EsqueciSenhaResponse {
  message: string;
}

export interface AuthServiceTypes {
  login(req: RequestLogin): Promise<boolean>;
  register(req: ResquestRegister): Promise<boolean>;
  esqueciSenha(req: EsqueciSenhaRequest): Promise<EsqueciSenhaResponse>;
}

export interface ResetPasswordRequest {
  token: string;
  senha: string;
}

export interface ResetPasswordResponse {
  message: string;
}

export interface AuthServiceTypes {
  login(req: RequestLogin): Promise<boolean>;
  register(req: ResquestRegister): Promise<boolean>;
  esqueciSenha(req: EsqueciSenhaRequest): Promise<EsqueciSenhaResponse>;
  resetPassword(req: ResetPasswordRequest): Promise<ResetPasswordResponse>;
}