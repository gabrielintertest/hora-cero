declare module '@google/genai';

declare namespace NodeJS {
  interface ProcessEnv {
    GEMINI_API_KEY: string;
  }
}

declare const process: {
  env: NodeJS.ProcessEnv;
};
