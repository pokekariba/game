import { RequestLogin, ResponseLogin, ResquestRegister } from "../@types/AuthServicesTypes";
import api from "../api/axios"
import { useAuthStore } from "../store/useAuthStore";
import { useGameStore } from "../store/useGameStore";

export const authService = {
    login: async (req:RequestLogin) => {
       const response = await api.post<ResponseLogin>('/login', req); 
       if (response.status === 200){
            console.log(response.headers);
        const token = response.headers['authorization'].split(' ')[1];
            
            useAuthStore.getState().setToken(token);
            
            useGameStore.getState().setUsuario(response.data);
            return true;
        }
        return false;
    },
    register: async (req:ResquestRegister) => {
        const response = await api.post<void>('/cadastro', req);
        if (response.status === 200){
            return true;
        }
        return false;
    },
    
}