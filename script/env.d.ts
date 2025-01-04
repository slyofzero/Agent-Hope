declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production";
      PORT: string | undefined;
      OPEN_AI_KEY: string | undefined;
    }
  }
}

export {};