import { create } from 'zustand';
import api from '../services/api';
import { API_PATHS } from '../utils/apiPaths';

const useSubscriptionStore = create((set) => ({
  plans: [],
  currentPlan: null,
  isLoading: false,
  checkoutLoading: false,

  fetchPlans: async () => {
    const { data } = await api.get(API_PATHS.SUBSCRIPTIONS.PLANS);
    set({ plans: data.plans });
  },

  fetchStatus: async () => {
    const { data } = await api.get(API_PATHS.SUBSCRIPTIONS.STATUS);
    set({ currentPlan: data });
    return data;
  },

  checkout: async (planId) => {
    set({ checkoutLoading: true });
    try {
      const { data } = await api.post(API_PATHS.SUBSCRIPTIONS.CHECKOUT, { planId });
      set({ checkoutLoading: false });
      return data;
    } catch (error) {
      set({ checkoutLoading: false });
      throw error;
    }
  },

  cancel: async () => {
    const { data } = await api.post(API_PATHS.SUBSCRIPTIONS.CANCEL);
    return data;
  },
}));

export default useSubscriptionStore;
