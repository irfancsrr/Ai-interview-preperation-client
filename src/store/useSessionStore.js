import { create } from 'zustand';
import api from '../services/api';
import { API_PATHS } from '../utils/apiPaths';

const useSessionStore = create((set) => ({
  sessions: [],
  currentSession: null,
  isLoading: false,
  error: null,

  createSession: async (sessionData) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post(API_PATHS.SESSIONS.CREATE, sessionData);
      set((state) => ({ sessions: [data, ...state.sessions], currentSession: data, isLoading: false }));
      return data;
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to create session';
      set({ error: msg, isLoading: false });
      throw new Error(msg);
    }
  },

  fetchSessions: async () => {
    set({ isLoading: true });
    try {
      const { data } = await api.get(API_PATHS.SESSIONS.MY_SESSIONS);
      set({ sessions: data, isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.message, isLoading: false });
    }
  },

  fetchSession: async (id) => {
    set({ isLoading: true });
    try {
      const { data } = await api.get(API_PATHS.SESSIONS.GET(id));
      set({ currentSession: data, isLoading: false });
      return data;
    } catch (error) {
      set({ error: error.response?.data?.message, isLoading: false });
    }
  },

  completeSession: async (id) => {
    const { data } = await api.put(API_PATHS.SESSIONS.COMPLETE(id));
    set((state) => ({
      currentSession: data,
      sessions: state.sessions.map(s => s._id === id ? data : s),
    }));
    return data;
  },

  deleteSession: async (id) => {
    await api.delete(API_PATHS.SESSIONS.DELETE(id));
    set((state) => ({
      sessions: state.sessions.filter(s => s._id !== id),
      currentSession: state.currentSession?._id === id ? null : state.currentSession,
    }));
  },

  submitAnswer: async (questionId, userAnswer) => {
    const { data } = await api.post(API_PATHS.QUESTIONS.ANSWER(questionId), { userAnswer });
    set((state) => {
      if (!state.currentSession) return state;
      const updatedQuestions = state.currentSession.questions.map(q =>
        q._id === questionId ? { ...q, userAnswer, aiScore: data.score, aiFeedback: data.feedback } : q
      );
      return { currentSession: { ...state.currentSession, questions: updatedQuestions } };
    });
    return data;
  },

  clearCurrent: () => set({ currentSession: null }),
}));

export default useSessionStore;
