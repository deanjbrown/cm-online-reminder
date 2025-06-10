/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ROUTER_TYPE: string;
  readonly VITE_SOME_OTHER_VAR?: string;
  readonly MODE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}