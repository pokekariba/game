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