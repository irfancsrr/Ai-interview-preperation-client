import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiEdit3, FiVideo, FiFileText, FiBarChart2, FiTrash2, FiClock } from 'react-icons/fi';
import toast from 'react-hot-toast';
import useAuthStore from '../store/useAuthStore';
import useSessionStore from '../store/useSessionStore';
import api from '../services/api';
import { API_PATHS } from '../utils/apiPaths';
import { getScoreBg, formatDate } from '../utils/constants';
import Loader from '../components/common/Loader';

export default function Dashboard() {
  const user = useAuthStore((s) => s.user);
  const { sessions, fetchSessions, deleteSession, isLoading } = useSessionStore();
  const [overview, setOverview] = useState(null);

  useEffect(() => {
    fetchSessions();
    api.get(API_PATHS.ANALYTICS.OVERVIEW).then(({ data }) => setOverview(data)).catch(() => {});
  }, [fetchSessions]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this session?')) return;
    try {
      await deleteSession(id);
      toast.success('Session deleted');
    } catch { toast.error('Failed to delete'); }
  };

  if (isLoading && sessions.length === 0) return <Loader text="Loading dashboard..." />;

  return (
    <div >
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name?.split(' ')[0]}!</h1>
        <p className="text-gray-500 mt-1">Here's your interview preparation overview</p>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 ">
        {[
          { label: 'Total Sessions', value: overview?.totalSessions || 0, color: 'text-indigo-600' },
          { label: 'Completed', value: overview?.completedSessions || 0, color: 'text-green-600' },
          { label: 'Avg Score', value: overview?.averageScore || 0, color: 'text-amber-600' },
          { label: 'Best Score', value: overview?.bestScore || 0, color: 'text-purple-600' },
        ].map(({ label, value, color }) => (
          <div key={label} className="card text-center">
            <p className="text-sm text-gray-500">{label}</p>
            <p className={`text-3xl font-bold ${color} mt-1`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { to: '/practice/new', icon: FiEdit3, label: 'New Practice', desc: 'Start an AI session', color: 'bg-indigo-50 text-indigo-600' },
          { to: '/video-interview', icon: FiVideo, label: 'Video Interview', desc: 'Practice with AI avatar', color: 'bg-purple-50 text-purple-600', premium: true },
          { to: '/resume', icon: FiFileText, label: 'Resume Review', desc: 'Upload & analyze', color: 'bg-green-50 text-green-600', premium: true },
          { to: '/analytics', icon: FiBarChart2, label: 'Analytics', desc: 'Track progress', color: 'bg-amber-50 text-amber-600', premium: true },
        ].map(({ to, icon: Icon, label, desc, color, premium }) => (
          <Link key={to} to={to} className={`card hover:shadow-md transition-shadow no-underline text-left relative ${premium && !user?.isPremium ? 'opacity-75' : ''}`}>
            {premium && !user?.isPremium && <span className="absolute top-2 right-2 badge-premium text-[10px]">PRO</span>}
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color} mb-3`}>
              <Icon size={20} />
            </div>
            <h3 className="font-semibold text-gray-900 text-sm">{label}</h3>
            <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
          </Link>
        ))}
      </div>

      {/* Premium Banner */}
      {!user?.isPremium && (
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white mb-8">
          <h3 className="font-bold text-lg mb-1">Unlock Premium Features</h3>
          <p className="text-indigo-100 text-sm mb-4">Get AI video interviews, resume reviews, analytics, and unlimited practice.</p>
          <Link to="/pricing" className="inline-block bg-white text-indigo-600 font-medium px-6 py-2 rounded-lg hover:bg-gray-50 no-underline text-sm">
            Upgrade Now
          </Link>
        </div>
      )}

      {/* Recent Sessions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Sessions</h2>
          <Link to="/practice/new" className="text-sm text-indigo-600 font-medium no-underline hover:text-indigo-700">+ New Session</Link>
        </div>
        {sessions.length === 0 ? (
          <div className="card text-center py-12">
            <FiEdit3 size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">No sessions yet. Start your first practice!</p>
            <Link to="/practice/new" className="btn-primary mt-4 inline-block no-underline text-sm">Create Session</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {sessions.slice(0, 5).map((session) => (
              <div key={session._id} className="card flex items-center justify-between !py-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-gray-900 text-sm truncate">{session.role}</h3>
                    {session.score !== null && session.score !== undefined && (
                      <span className={`text-xs font-bold px-2 py-0.5 rounded ${getScoreBg(session.score)}`}>{session.score}/100</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><FiClock size={12} /> {formatDate(session.createdAt)}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${session.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                      {session.status}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Link to={`/practice/${session._id}`} className="text-sm text-indigo-600 font-medium no-underline hover:text-indigo-700">
                    {session.status === 'completed' ? 'Review' : 'Continue'}
                  </Link>
                  <button onClick={() => handleDelete(session._id)} className="text-gray-400 hover:text-red-600 p-1"><FiTrash2 size={16} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
