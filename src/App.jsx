import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Usuarios from './pages/Usuarios';
import Setores from './pages/Setores'; 
import Veiculos from './pages/Veiculos'; // Importar aqui
import Abastecimentos from './pages/Abastecimentos';
import './App.css';

const RotaPrivada = ({ children }) => {
  const token = localStorage.getItem('sga_token');
  if (!token) return <Navigate to="/login" />;
  return (
    <div className="app-wrapper">
      <Sidebar />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/" element={<RotaPrivada><Dashboard /></RotaPrivada>} />
        <Route path="/usuarios" element={<RotaPrivada><Usuarios /></RotaPrivada>} />
        <Route path="/veiculos" element={<RotaPrivada><Veiculos /></RotaPrivada>} /> {/* Rota Nova */}
        <Route path="/setores" element={<RotaPrivada><Setores /></RotaPrivada>} />
        <Route path="/abastecimentos" element={<RotaPrivada><Abastecimentos /></RotaPrivada>} />
        
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;