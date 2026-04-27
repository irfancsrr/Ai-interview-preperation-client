export const API_BASE = 'http://localhost:5000/api';

export const API_PATHS = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    PROFILE: '/auth/profile',
    UPDATE_PROFILE: '/auth/profile',
    UPLOAD_IMAGE: '/auth/upload-image',
  },
  SESSIONS: {
    CREATE: '/sessions/create',
    MY_SESSIONS: '/sessions/my-sessions',
    GET: (id) => `/sessions/${id}`,
    COMPLETE: (id) => `/sessions/${id}/complete`,
    DELETE: (id) => `/sessions/${id}`,
  },
  QUESTIONS: {
    ANSWER: (id) => `/questions/${id}/answer`,
    PIN: (id) => `/questions/${id}/pin`,
    NOTE: (id) => `/questions/${id}/note`,
  },
  VIDEO: {
    START: '/video-interviews/start',
    HISTORY: '/video-interviews/history',
    GET: (id) => `/video-interviews/${id}`,
    ANSWER: (id) => `/video-interviews/${id}/answer`,
    NEXT: (id) => `/video-interviews/${id}/next`,
    END: (id) => `/video-interviews/${id}/end`,
  },
  SUBSCRIPTIONS: {
    PLANS: '/subscriptions/plans',
    CHECKOUT: '/subscriptions/checkout',
    CHECKOUTBYSTRIPE:'/subscriptions/checkoutByStripe',
    PLANID: `/subscriptions/planId`,
    STATUS: '/subscriptions/status',
    CANCEL: '/subscriptions/cancel',
  },
  RESUMES: {
    UPLOAD: '/resumes/upload',
    MY_RESUMES: '/resumes/my-resumes',
    GET: (id) => `/resumes/${id}`,
    DELETE: (id) => `/resumes/${id}`,
  },
  ANALYTICS: {
    OVERVIEW: '/analytics/overview',
    PROGRESS: '/analytics/progress',
    STRENGTHS: '/analytics/strengths',
    HISTORY: '/analytics/history',
  },
  FEEDBACK: {
    GET: (sessionId) => `/feedback/${sessionId}`,
    GENERATE: (sessionId) => `/feedback/${sessionId}/generate`,
    ALL: '/feedback/all',
  },
};
