export interface User {
  _id: string;
  email: string;
  name: string;
  customDomain?: string;
  createdAt: Date;
}

export interface Url {
  _id: string;
  originalUrl: string;
  shortCode: string;
  customDomain?: string;
  userId: string;
  clicks: number;
  createdAt: Date;
  expiresAt?: Date;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
  token?: string;
}

export interface UrlResponse {
  success: boolean;
  message: string;
  url?: Url;
  urls?: Url[];
}
