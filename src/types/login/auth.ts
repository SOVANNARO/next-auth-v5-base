export interface auth {
  access_token: string;
  refresh_token: string;
}

export interface profile {
  id: string;
  email: string;
  password: string;
  name: string;
  role: string;
  avatar: string;
  creationAt: Date;
  updatedAt: Date;
}

export interface User {
  name: string;
  email: string;
  sub: string;
  id: string;
  password: string;
  role: string;
  avatar: string;
  creationAt: string;
  updatedAt: string;
  iat: number;
  exp: number;
  jti: string;
}

export interface Session {
  user: User;
  expires: string;
}