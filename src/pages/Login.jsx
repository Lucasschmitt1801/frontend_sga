// src/pages/Login.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Fuel, Lock, Mail } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || 'https://sga-api-ovqp.onrender.com';

  const fazerLogin = async (e) => {
    e.preventDefault();
    setErro('');
    setLoading(true);

    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', senha);

    try {
      const res = await axios.post(`${API_URL}/auth/login`, formData);
      const token = res.data.access_token;
      
      localStorage.setItem('sga_token', token);
      navigate('/'); 
    } catch (error) {
      setErro("Acesso negado. Verifique suas credenciais.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-box">
        <div style={{ marginBottom: '20px' }}>
            <div style={{ background: '#e3f2fd', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px' }}>
                <Fuel size={40} color="#0056b3" />
            </div>
            <h2 style={{ color: '#333', margin: 0 }}>SGA Admin</h2>
            <p style={{ color: '#666', fontSize: '14px', marginTop: '5px' }}>Gestão Inteligente de Frotas</p>
        </div>

        <form onSubmit={fazerLogin} style={{ textAlign: 'left' }}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', fontSize: '14px' }}>Email</label>
            <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: '#999' }} />
                <input className="form-control" style={{ paddingLeft: '40px' }} value={email} onChange={(e) => setEmail(e.target.value)} type="email" required placeholder="admin@sga.com" />
            </div>
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', fontSize: '14px' }}>Senha</label>
            <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: '#999' }} />
                <input className="form-control" style={{ paddingLeft: '40px' }} value={senha} onChange={(e) => setSenha(e.target.value)} type="password" required placeholder="••••••" />
            </div>
          </div>
          
          {erro && <div style={{ color: '#dc3545', background: '#f8d7da', padding: '10px', borderRadius: '6px', fontSize: '13px', marginBottom: '15px', textAlign: 'center' }}>{erro}</div>}
          
          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px' }} disabled={loading}>
            {loading ? 'Entrando...' : 'ENTRAR'}
          </button>
        </form>
      </div>
    </div>
  );
}