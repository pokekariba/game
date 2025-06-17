interface EnvConfig {
  SERVER_URL: string;
  VITE_PORT: number;
}

const env: EnvConfig = {
  SERVER_URL: import.meta.env.VITE_SERVER_URL,
  VITE_PORT: Number(import.meta.env.VITE_PORT),
};

export default env;
