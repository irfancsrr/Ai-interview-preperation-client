import { NavLink } from 'react-router-dom';
import { FiHome, FiEdit3, FiVideo, FiFileText, FiBarChart2, FiCreditCard } from 'react-icons/fi';
import useAuthStore from '../../store/useAuthStore';

const navItems = [
  { to: '/dashboard', icon: FiHome, label: 'Dashboard' },
  { to: '/practice/new', icon: FiEdit3, label: 'Practice' },
  { to: '/video-interview', icon: FiVideo, label: 'Video Interview', premium: true },
  { to: '/resume', icon: FiFileText, label: 'Resume Review', premium: true },
  { to: '/analytics', icon: FiBarChart2, label: 'Analytics', premium: true },
  { to: '/pricing', icon: FiCreditCard, label: 'Pricing' },
];

export default function Sidebar({menuOpen,setMenuOpen}) {
  const user = useAuthStore((s) => s.user);

  return (
    <>
    {/* mobile side bar */}
<aside
        className={`fixed inset-y-0 left-0 top-16 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out z-40 lg:hidden ${
          menuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ to, icon: Icon, label, premium }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setMenuOpen(false)} // close menu after navigation
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors no-underline ${
                  isActive ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <Icon size={18} />
              <span>{label}</span>
              {premium && !user?.isPremium && (
                <span className="ml-auto text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-bold">PRO</span>
              )}
            </NavLink>
          ))}
        </nav>
      </aside>

    {/* desktop side bar     */}
    <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-4rem)]">
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ to, icon: Icon, label, premium }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors no-underline ${
                isActive ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <Icon size={18} />
            <span>{label}</span>
            {premium && !user?.isPremium && (
              <span className="ml-auto text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-bold">PRO</span>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
    </>
  );
}
