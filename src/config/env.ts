import dotenv from 'dotenv';
dotenv.config();

interface EnvConfig {
  SERVER_URL: string;
  API_KEY: string;
	VITE_PORT: number;
}

const env: EnvConfig = {
  SERVER_URL: process.env.SERVER_URL || 'http://localhost:3000',  // Valor default caso não haja variável no .env
  API_KEY: process.env.API_KEY || '',  // Valor default vazio
	VITE_PORT: parseInt(process.env.VITE_PORT || '4200'), // Valor default caso não haja variável no .env
};

export default env;
