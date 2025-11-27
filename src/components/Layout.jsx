import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Car, FileText, LogOut, Menu, X } from 'lucide-react';

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/' },
    { icon: <Users size={20} />, label: 'Usuários', path: '/usuarios' },
    { icon: <Car size={20} />, label: 'Veículos', path: '/veiculos' },
    { icon: <FileText size={20} />, label: 'Abastecimentos', path: '/abastecimentos' },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      
      {/* SIDEBAR */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-[#0056b3] text-white transition-all duration-300 flex flex-col shadow-lg`}>
        <div className="p-4 flex items-center justify-between border-b border-blue-600">
          {sidebarOpen && <h1 className="text-xl font-bold tracking-wider">SGA ADMIN</h1>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 hover:bg-blue-600 rounded">
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 mt-6">
          {menuItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path}
              className={`flex items-center px-4 py-3 mb-1 transition-colors ${
                location.pathname === item.path ? 'bg-blue-700 border-l-4 border-white' : 'hover:bg-blue-600'
              }`}
            >
              {item.icon}
              {sidebarOpen && <span className="ml-3 font-medium">{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-blue-600">
          <button onClick={handleLogout} className="flex items-center w-full px-4 py-2 hover:bg-red-500 rounded transition-colors text-red-100">
            <LogOut size={20} />
            {sidebarOpen && <span className="ml-3">Sair</span>}
          </button>
        </div>
      </aside>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  );
}