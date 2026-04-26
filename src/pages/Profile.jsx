import { useState } from 'react';
import { FiUser, FiMail, FiStar, FiCalendar, FiLogOut } from 'react-icons/fi';
import toast from 'react-hot-toast';
import useAuthStore from '../store/useAuthStore';
import { formatDate } from '../utils/constants';

export default function Profile() {
  const { user, updateProfile, logout } = useAuthStore();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile({ name, email });
      toast.success('Profile updated');
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Profile</h1>
      <p className="text-gray-500 mb-8">Manage your account settings</p>

      {/* Account Info */}
      <div className="card mb-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center">
            <FiUser size={28} className="text-indigo-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{user?.name}</h3>
            <p className="text-sm text-gray-500">{user?.email}</p>
            {user?.isPremium && <span className="badge-premium mt-1 inline-block">PRO</span>}
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <div className="relative">
              <FiUser className="absolute left-3 top-3 text-gray-400" size={16} />
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="input-field pl-10" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <div className="relative">
              <FiMail className="absolute left-3 top-3 text-gray-400" size={16} />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field pl-10" />
            </div>
          </div>
          <button type="submit" disabled={saving} className="btn-primary w-full">
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>

      {/* Subscription */}
      <div className="card mb-6">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2"><FiStar size={16} /> Subscription</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Plan</span>
            <span className="font-medium text-gray-900">{user?.isPremium ? 'Premium' : 'Free'}</span>
          </div>
          {user?.premiumExpiresAt && (
            <div className="flex justify-between">
              <span className="text-gray-500">Expires</span>
              <span className="font-medium text-gray-900">{formatDate(user.premiumExpiresAt)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Account Info */}
      <div className="card mb-6">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2"><FiCalendar size={16} /> Account</h3>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Member since</span>
          <span className="font-medium text-gray-900">{formatDate(user?.createdAt)}</span>
        </div>
      </div>

      <button onClick={logout} className="btn-danger w-full flex items-center justify-center gap-2">
        <FiLogOut size={16} /> Sign Out
      </button>
    </div>
  );
}
