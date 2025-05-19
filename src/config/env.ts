interface EnvConfig {
  SERVER_URL: string;
  API_KEY: string;
  VITE_PORT: number;
}

const env: EnvConfig = {
  SERVER_URL: import.meta.env.VITE_SERVER_URL,  
  API_KEY: import.meta.env.VITE_API_KEY, 
  VITE_PORT: Number(import.meta.env.VITE_PORT)
};

export default env;
