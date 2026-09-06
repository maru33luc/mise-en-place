export interface User {
  id: number;
  name: string;
  email: string;
  createdAt?: string;
}

export interface AuthPayload {
  name?: string;
  email: string;
  password: string;
}
