import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useState } from 'react';

export default function DashboardLayout() {
const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <div className="flex">
        <Sidebar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
        <main className="flex-1 p-6 lg:p-8 max-w-5xl">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
