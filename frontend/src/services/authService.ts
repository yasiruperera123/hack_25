import api from '../utils/api';
// Assuming you have user types defined somewhere, e.g., in types/user.ts
// import { IUser } from '../types/user';

// Placeholder user and login response types
interface IUser {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

interface ILoginResponse {
  token: string;
  user: IUser;
  // refreshToken?: string; // Include if using refresh tokens
}

export const authService = {
  /**
   * Calls the backend login endpoint.
   * @param email User's email.
   * @param password User's password.
   * @returns A promise that resolves with the user data and token.
   */
  async login(email: string, password: string): Promise<ILoginResponse> {
    const response = await api.post<ILoginResponse>('/auth/login', { email, password });
    return response.data;
  },

  // TODO: Add register, logout, refreshToken functions

  // async register(userData: any): Promise<ILoginResponse> {
  //   const response = await api.post<ILoginResponse>('/auth/register', userData);
  //   return response.data;
  // },

  // async logout(): Promise<void> {
  //   await api.post('/auth/logout'); // Assuming a backend logout endpoint
  // },

  // async refreshToken(refreshToken: string): Promise<ILoginResponse> {
  //   const response = await api.post<ILoginResponse>('/auth/refresh', { refreshToken });
  //   return response.data;
  // }
}; 