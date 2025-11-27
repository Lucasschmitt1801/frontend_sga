// src/components/Sidebar.jsx
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, FileText, LogOut, Fuel } from 'lucide-react';

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm("Tem certeza que deseja sair do sistema?")) {
      localStorage.removeItem('sga_token');
      navigate('/login');
    }
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <Fuel size={28} color="#ffc107" />
        <span>SGA Admin</span>
      </div>

      <nav className="sidebar-menu">
        <NavLink 
          to="/" 
          className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}
        >
          <LayoutDashboard size={20} />
          <span>Visão Geral</span>
        </NavLink>
        
        <NavLink 
          to="/usuarios" 
          className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}
        >
          <Users size={20} />
          <span>Colaboradores</span>
        </NavLink>

        <NavLink 
          to="/abastecimentos" 
          className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}
        >
          <FileText size={20} />
          <span>Auditoria</span>
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <button onClick={handleLogout} className="btn-logout">
          <LogOut size={18} />
          Sair do Sistema
        </button>
      </div>
    </aside>
  );
}