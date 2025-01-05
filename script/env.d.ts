declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production";
      PORT: string | undefined;
      OPEN_AI_KEY: string | undefined;
      BEARER_TOKEN: string | undefined;
      RPC_ENDPOINT: string | undefined;
      API_URL: string | undefined;
    }
  }
}

export {};
