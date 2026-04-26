import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiMenu, FiX, FiLogOut, FiUser } from 'react-icons/fi';
import { useState } from 'react';
import useAuthStore from '../../store/useAuthStore';

export default function Navbar({menuOpen,setMenuOpen}) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  // const [menuOpen, setMenuOpen] = useState(false);
  const isLanding = location.pathname === '/';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (isLanding && !user) {
    return (
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <Link to="/" className="text-xl font-bold text-indigo-600 no-underline">InterviewAI</Link>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-gray-600 hover:text-indigo-600 font-medium no-underline">Login</Link>
            <Link to="/signup" className="btn-primary text-sm no-underline">Get Started</Link>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <div className="flex items-center gap-4">
          <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden p-2 text-gray-600">
            {menuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
          <Link to="/dashboard" className="text-xl font-bold text-indigo-600 no-underline">InterviewAI</Link>
          {user?.isPremium && <span className="badge-premium">PRO</span>}
        </div>
        <div className="flex items-center gap-4">
          <Link to="/profile" className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 no-underline">
            <FiUser size={18} />
            <span className="hidden sm:inline text-sm font-medium">{user?.name}</span>
          </Link>
          <button onClick={handleLogout} className="text-gray-500 hover:text-red-600 p-2" title="Logout">
            <FiLogOut size={18} />
          </button>
        </div>
      </div>
    </nav>
  );
}
