import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import useSessionStore from '../store/useSessionStore';
import { EXPERIENCE_LEVELS } from '../utils/constants';

const TOPICS = ['JavaScript', 'React', 'Node.js', 'Python', 'Java', 'SQL', 'System Design', 'Data Structures', 'Algorithms', 'CSS', 'TypeScript', 'AWS', 'Docker', 'Git', 'REST APIs', 'GraphQL', 'Testing', 'CI/CD', 'Agile', 'Leadership'];

export default function CreateSession() {
  const [role, setRole] = useState('');
  const [experience, setExperience] = useState('mid-level');
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [description, setDescription] = useState('');
  const { createSession, isLoading } = useSessionStore();
  const navigate = useNavigate();

  const toggleTopic = (topic) => {
    setSelectedTopics(prev => prev.includes(topic) ? prev.filter(t => t !== topic) : [...prev, topic]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!role.trim()) { toast.error('Please enter a job role'); return; }
    try {
      const session = await createSession({ role, experience, topicsToFocus: selectedTopics, description });
      toast.success('Session created! Questions generated.');
      navigate(`/practice/${session._id}`);
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">New Practice Session</h1>
      <p className="text-gray-500 mb-8">Configure your interview practice session</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Target Job Role *</label>
          <input type="text" value={role} onChange={(e) => setRole(e.target.value)} className="input-field"
            placeholder="e.g., Senior Frontend Developer" required />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Experience Level</label>
          <select value={experience} onChange={(e) => setExperience(e.target.value)} className="input-field">
            {EXPERIENCE_LEVELS.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Topics to Focus On</label>
          <div className="flex flex-wrap gap-2">
            {TOPICS.map(topic => (
              <button key={topic} type="button" onClick={() => toggleTopic(topic)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  selectedTopics.includes(topic) ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                {topic}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes (optional)</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="input-field" rows={3}
            placeholder="Any specific areas you'd like to focus on..." />
        </div>

        <button type="submit" disabled={isLoading} className="btn-primary w-full">
          {isLoading ? 'Generating questions with AI...' : 'Start Practice Session'}
        </button>
      </form>
    </div>
  );
}
