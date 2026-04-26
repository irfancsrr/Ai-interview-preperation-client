import { create } from 'zustand';
import api from '../services/api';
import { API_PATHS } from '../utils/apiPaths';

const useResumeStore = create((set) => ({
  resumes: [],
  currentResume: null,
  isLoading: false,
  isUploading: false,

  uploadResume: async (file, targetRole = '') => {
    set({ isUploading: true });
    const formData = new FormData();
    formData.append('resume', file);
    if (targetRole) formData.append('targetRole', targetRole);
    try {
      const { data } = await api.post(API_PATHS.RESUMES.UPLOAD, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      set((state) => ({ resumes: [data, ...state.resumes], currentResume: data, isUploading: false }));
      return data;
    } catch (error) {
      set({ isUploading: false });
      throw error;
    }
  },

  fetchResumes: async () => {
    set({ isLoading: true });
    const { data } = await api.get(API_PATHS.RESUMES.MY_RESUMES);
    set({ resumes: data, isLoading: false });
  },

  fetchResume: async (id) => {
    set({ isLoading: true });
    const { data } = await api.get(API_PATHS.RESUMES.GET(id));
    set({ currentResume: data, isLoading: false });
    return data;
  },

  deleteResume: async (id) => {
    await api.delete(API_PATHS.RESUMES.DELETE(id));
    set((state) => ({ resumes: state.resumes.filter(r => r._id !== id) }));
  },
}));

export default useResumeStore;
