
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly REACT_APP_SUPABASE_URL: string;
  readonly REACT_APP_SUPABASE_ANON_KEY: string;
  readonly DEV: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
