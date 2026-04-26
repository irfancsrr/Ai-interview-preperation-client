import { useEffect, useState } from 'react';
import { FiTrendingUp, FiAward, FiTarget, FiClock } from 'react-icons/fi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import api from '../services/api';
import { API_PATHS } from '../utils/apiPaths';
import { getScoreBg, formatDate } from '../utils/constants';
import Loader from '../components/common/Loader';

export default function Analytics() {
  const [overview, setOverview] = useState(null);
  const [progress, setProgress] = useState([]);
  const [strengths, setStrengths] = useState(null);
  const [history, setHistory] = useState({ sessions: [], pagination: {} });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [ovr, prg, str, hist] = await Promise.all([
          api.get(API_PATHS.ANALYTICS.OVERVIEW),
          api.get(API_PATHS.ANALYTICS.PROGRESS),
          api.get(API_PATHS.ANALYTICS.STRENGTHS),
          api.get(API_PATHS.ANALYTICS.HISTORY),
        ]);
        setOverview(ovr.data);
        setProgress(prg.data);
        setStrengths(str.data);
        setHistory(hist.data);
      } catch (err) {
        console.error('Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) return <Loader text="Loading analytics..." />;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Performance Analytics</h1>
      <p className="text-gray-500 mb-8">Track your interview preparation progress</p>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { icon: FiTarget, label: 'Total Sessions', value: overview?.totalSessions || 0, color: 'text-indigo-600 bg-indigo-50' },
          { icon: FiAward, label: 'Completed', value: overview?.completedSessions || 0, color: 'text-green-600 bg-green-50' },
          { icon: FiTrendingUp, label: 'Avg Score', value: overview?.averageScore || 0, color: 'text-amber-600 bg-amber-50' },
          { icon: FiAward, label: 'Best Score', value: overview?.bestScore || 0, color: 'text-purple-600 bg-purple-50' },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="card">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color} mb-2`}>
              <Icon size={20} />
            </div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-xs text-gray-500">{label}</p>
          </div>
        ))}
      </div>

      {/* Progress Chart */}
      {progress.length > 0 && (
        <div className="card mb-8">
          <h3 className="font-semibold text-gray-900 mb-4">Score Progress</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={progress}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="score" stroke="#4F46E5" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Strengths & Weaknesses */}
      {strengths && (strengths.strengths?.length > 0 || strengths.weaknesses?.length > 0) && (
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="card">
            <h3 className="font-semibold text-green-700 mb-3">Top Strengths</h3>
            {strengths.strengths?.length > 0 ? (
              <div className="space-y-3">
                {strengths.strengths.map((s) => (
                  <div key={s.category} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">{s.category}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: `${(s.avgScore / 10) * 100}%` }} />
                      </div>
                      <span className="text-sm font-medium text-green-600">{s.avgScore}/10</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : <p className="text-sm text-gray-400">Complete more sessions to see strengths</p>}
          </div>
          <div className="card">
            <h3 className="font-semibold text-amber-700 mb-3">Areas to Improve</h3>
            {strengths.weaknesses?.length > 0 ? (
              <div className="space-y-3">
                {strengths.weaknesses.map((w) => (
                  <div key={w.category} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">{w.category}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div className="bg-amber-500 h-2 rounded-full" style={{ width: `${(w.avgScore / 10) * 100}%` }} />
                      </div>
                      <span className="text-sm font-medium text-amber-600">{w.avgScore}/10</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : <p className="text-sm text-gray-400">Complete more sessions to see areas for improvement</p>}
          </div>
        </div>
      )}

      {/* Category Breakdown */}
      {strengths?.all?.length > 0 && (
        <div className="card mb-8">
          <h3 className="font-semibold text-gray-900 mb-4">Category Performance</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={strengths.all}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="category" tick={{ fontSize: 12 }} />
              <YAxis domain={[0, 10]} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="avgScore" fill="#4F46E5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Session History */}
      {history.sessions?.length > 0 && (
        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-4">Session History</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b border-gray-200">
                  <th className="pb-2 text-gray-500 font-medium">Date</th>
                  <th className="pb-2 text-gray-500 font-medium">Role</th>
                  <th className="pb-2 text-gray-500 font-medium">Type</th>
                  <th className="pb-2 text-gray-500 font-medium">Score</th>
                  <th className="pb-2 text-gray-500 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {history.sessions.map((s) => (
                  <tr key={s._id} className="border-b border-gray-100 last:border-0">
                    <td className="py-2 text-gray-600">{formatDate(s.createdAt)}</td>
                    <td className="py-2 text-gray-900">{s.role}</td>
                    <td className="py-2"><span className={`text-xs px-2 py-0.5 rounded ${s.type === 'video' ? 'bg-purple-100 text-purple-700' : 'bg-indigo-100 text-indigo-700'}`}>{s.type}</span></td>
                    <td className="py-2">{s.score != null ? <span className={`text-xs font-bold px-2 py-0.5 rounded ${getScoreBg(s.score)}`}>{s.score}</span> : '-'}</td>
                    <td className="py-2"><span className={`text-xs px-2 py-0.5 rounded ${s.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{s.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
