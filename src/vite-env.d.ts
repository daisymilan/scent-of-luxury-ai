
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly REACT_APP_SUPABASE_URL: string;
  readonly REACT_APP_SUPABASE_ANON_KEY: string;
  readonly DEV: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Add extended user type to include woocommerce_id
declare namespace Database {
  interface UserData {
    avatar_url: string;
    created_at: string;
    email: string;
    first_name: string;
    id: string;
    last_name: string;
    last_voice_auth: string;
    role: string;
    updated_at: string;
    user_id: string;
    voice_authenticated: boolean;
    voice_enrolled: boolean;
    woocommerce_id?: number | null;  // Added this field to fix the error
  }
}
