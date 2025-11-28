import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, FileText, LogOut, Fuel, Layers, CarFront } from 'lucide-react';

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm("Deseja realmente sair?")) {
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
        <NavLink to="/" className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}>
          <LayoutDashboard size={20} />
          <span>Visão Geral</span>
        </NavLink>
        
        <NavLink to="/veiculos" className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}>
          <CarFront size={20} />
          <span>Veículos</span>
        </NavLink>

        <NavLink to="/usuarios" className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}>
          <Users size={20} />
          <span>Cadastros</span>
        </NavLink>

        <NavLink to="/setores" className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}>
          <Layers size={20} />
          <span>Setores</span>
        </NavLink>

        <NavLink to="/abastecimentos" className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}>
          <FileText size={20} />
          <span>Auditoria</span>
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <button onClick={handleLogout} className="btn-logout">
          <LogOut size={18} /> Sair
        </button>
      </div>
    </aside>
  );
}