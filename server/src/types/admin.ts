export interface Admin {
  id: number;
  username: string;
  password_hash: string;
  created_at: string;
  last_login: string | null;
} 