import { create } from 'zustand';
import api from '../services/api';
import { API_PATHS } from '../utils/apiPaths';

const useInterviewStore = create((set, get) => ({
  currentInterview: null,
  currentQuestion: null,
  questionIndex: 0,
  expectedTopics: [],
  history: [],
  isLoading: false,
  isProcessing: false,
  lastScore: null,
  lastFeedback: null,

  startInterview: async (role, experience, interviewType) => {
    set({ isLoading: true });
    try {
      const { data } = await api.post(API_PATHS.VIDEO.START, { role, experience, interviewType });
      set({
        currentInterview: data.interviewId,
        currentQuestion: data.question,
        questionIndex: data.questionIndex,
        expectedTopics: data.expectedTopics || [],
        isLoading: false,
        lastScore: null,
        lastFeedback: null,
      });
      return data;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  submitAnswer: async (transcript) => {
    set({ isProcessing: true });
    const { currentInterview, questionIndex } = get();
    try {
      const { data } = await api.post(API_PATHS.VIDEO.ANSWER(currentInterview), {
        questionIndex,
        transcript,
      });
      set({ lastScore: data.score, lastFeedback: data.feedback, isProcessing: false });
      return data;
    } catch (error) {
      set({ isProcessing: false });
      throw error;
    }
  },

  getNextQuestion: async () => {
    set({ isProcessing: true });
    const { currentInterview } = get();
    try {
      const { data } = await api.post(API_PATHS.VIDEO.NEXT(currentInterview));
      if (data.done) {
        set({ isProcessing: false });
        return { done: true };
      }
      set({
        currentQuestion: data.question,
        questionIndex: data.questionIndex,
        expectedTopics: data.expectedTopics || [],
        isProcessing: false,
        lastScore: null,
        lastFeedback: null,
      });
      return data;
    } catch (error) {
      set({ isProcessing: false });
      throw error;
    }
  },

  endInterview: async () => {
    set({ isProcessing: true });
    const { currentInterview } = get();
    try {
      const { data } = await api.post(API_PATHS.VIDEO.END(currentInterview));
      set({ isProcessing: false });
      return data;
    } catch (error) {
      set({ isProcessing: false });
      throw error;
    }
  },

  fetchHistory: async () => {
    const { data } = await api.get(API_PATHS.VIDEO.HISTORY);
    set({ history: data });
  },

  fetchInterview: async (id) => {
    const { data } = await api.get(API_PATHS.VIDEO.GET(id));
    return data;
  },

  reset: () => set({
    currentInterview: null, currentQuestion: null, questionIndex: 0,
    expectedTopics: [], isLoading: false, isProcessing: false, lastScore: null, lastFeedback: null,
  }),
}));

export default useInterviewStore;
