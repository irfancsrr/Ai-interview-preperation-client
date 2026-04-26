import { create } from 'zustand';
import api from '../services/api';
import { API_PATHS } from '../utils/apiPaths';

const useAuthStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  token: localStorage.getItem('token') || null,
  isLoading: false,
  error: null,

  get isPremium() {
    return get().user?.isPremium || false;
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post(API_PATHS.AUTH.LOGIN, { email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      set({ user: data.user, token: data.token, isLoading: false });
      return data;
    } catch (error) {
      const msg = error.response?.data?.message || 'Login failed';
      set({ error: msg, isLoading: false });
      throw new Error(msg);
    }
  },

  register: async (name, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post(API_PATHS.AUTH.REGISTER, { name, email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      set({ user: data.user, token: data.token, isLoading: false });
      return data;
    } catch (error) {
      const msg = error.response?.data?.message || 'Registration failed';
      set({ error: msg, isLoading: false });
      throw new Error(msg);
    }
  },

  fetchProfile: async () => {
    try {
      const { data } = await api.get(API_PATHS.AUTH.PROFILE);
      localStorage.setItem('user', JSON.stringify(data));
      set({ user: data });
    } catch {
      // silently fail
    }
  },

  updateProfile: async (updates) => {
    const { data } = await api.put(API_PATHS.AUTH.UPDATE_PROFILE, updates);
    localStorage.setItem('user', JSON.stringify(data));
    set({ user: data });
    return data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, token: null, error: null });
  },

  clearError: () => set({ error: null }),

  setUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user));
    set({ user });
  },
}));

export default useAuthStore;
