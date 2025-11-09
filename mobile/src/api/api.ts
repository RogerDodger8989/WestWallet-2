import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Ändra detta till din dators lokala IP om du kör på riktigt device
// För emulator: använd 10.0.2.2 (Android) eller localhost (iOS)
const API_BASE_URL = 'http://10.0.2.2:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor för att lägga till JWT token i requests
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export interface User {
  id: number;
  username: string;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}

export interface Wallet {
  id: number;
  name: string;
  currency: string;
  balance?: number;
}

export interface Transaction {
  id: number;
  amount: number;
  type: 'credit' | 'debit';
  description?: string;
  createdAt: string;
}

// Auth API
export const authAPI = {
  register: async (username: string, password: string): Promise<User> => {
    const { data } = await api.post('/auth/register', { username, password });
    return data;
  },

  login: async (username: string, password: string): Promise<LoginResponse> => {
    const { data } = await api.post('/auth/login', { username, password });
    await AsyncStorage.setItem('accessToken', data.access_token);
    return data;
  },

  logout: async () => {
    await AsyncStorage.removeItem('accessToken');
  },
};

// Wallets API
export const walletsAPI = {
  list: async (): Promise<Wallet[]> => {
    const { data } = await api.get('/wallets');
    return data;
  },

  get: async (id: number): Promise<Wallet> => {
    const { data } = await api.get(`/wallets/${id}`);
    return data;
  },

  create: async (name: string, currency: string = 'SEK'): Promise<Wallet> => {
    const { data } = await api.post('/wallets', { name, currency });
    return data;
  },

  getTransactions: async (walletId: number): Promise<Transaction[]> => {
    const { data } = await api.get(`/wallets/${walletId}/transactions`);
    return data;
  },

  createTransaction: async (
    walletId: number,
    amount: number,
    type: 'credit' | 'debit',
    description?: string
  ): Promise<Transaction> => {
    const { data } = await api.post(`/wallets/${walletId}/transactions`, {
      amount,
      type,
      description,
    });
    return data;
  },
};

export default api;
