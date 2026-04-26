export const PLANS = {
  free: { name: 'Free', price: 0, period: 'forever' },
  monthly: { name: 'Monthly Premium', price: 9.99, period: 'month' },
  yearly: { name: 'Yearly Premium', price: 79.99, period: 'year' },
};

export const FREE_DAILY_LIMIT = 5;

export const INTERVIEW_TYPES = [
  { value: 'technical', label: 'Technical' },
  { value: 'behavioral', label: 'Behavioral' },
  { value: 'mixed', label: 'Mixed' },
];

export const EXPERIENCE_LEVELS = [
  { value: 'fresher', label: 'Fresher (0-1 years)' },
  { value: 'junior', label: 'Junior (1-3 years)' },
  { value: 'mid-level', label: 'Mid-Level (3-5 years)' },
  { value: 'senior', label: 'Senior (5-8 years)' },
  { value: 'lead', label: 'Lead/Staff (8+ years)' },
];

export const getScoreColor = (score, max = 100) => {
  const pct = (score / max) * 100;
  if (pct >= 70) return 'text-green-600';
  if (pct >= 40) return 'text-amber-600';
  return 'text-red-600';
};

export const getScoreBg = (score, max = 100) => {
  const pct = (score / max) * 100;
  if (pct >= 70) return 'bg-green-100 text-green-800';
  if (pct >= 40) return 'bg-amber-100 text-amber-800';
  return 'bg-red-100 text-red-800';
};

export const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
};
