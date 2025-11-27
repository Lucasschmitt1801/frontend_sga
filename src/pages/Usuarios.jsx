// src/pages/Usuarios.jsx
import React, { useState } from 'react';
import { UserPlus, RefreshCw, CheckCircle } from 'lucide-react';
import axios from 'axios';

export default function Usuarios() {
  const [nome, setNome] = useState('');
  const [empresa, setEmpresa] = useState('SGA');
  const [perfil, setPerfil] = useState('EXECUTOR');
  
  const [emailGerado, setEmailGerado] = useState('');
  const [senhaGerada, setSenhaGerada] = useState('');
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'https://sga-api-ovqp.onrender.com';
  const token = localStorage.getItem('sga_token');

  const gerarCredenciais = () => {
    if (!nome) return alert("Preencha o nome do colaborador.");
    const nomes = nome.toLowerCase().trim().split(' ');
    const primeiro = nomes[0];
    const ultimo = nomes.length > 1 ? nomes[nomes.length - 1] : '';
    
    const emailFinal = `${primeiro}.${ultimo}@${empresa.toLowerCase().replace(/\s/g, '')}.com`.replace('..', '.');
    const senhaFinal = `${primeiro.charAt(0).toUpperCase() + primeiro.slice(1)}@2025`;

    setEmailGerado(emailFinal);
    setSenhaGerada(senhaFinal);
  };

  const salvarUsuario = async () => {
    if (!emailGerado) return;
    setLoading(true);
    try {
        await axios.post(`${API_URL}/usuarios/`, 
            { nome, email: emailGerado, senha: senhaGerada, perfil }, 
            { headers: { Authorization: `Bearer ${token}` } }
        );
        alert(`Usuário criado!\nLogin: ${emailGerado}\nSenha: ${senhaGerada}`);
        setNome(''); setEmailGerado(''); setSenhaGerada('');
    } catch {
        alert("Erro ao criar usuário. Verifique se você é ADMIN.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Colaboradores</h1>
      </div>

      <div className="grid-dashboard">
        <div className="card">
            <h3 style={{ marginBottom: '20px' }}>1. Novo Cadastro</h3>
            <input className="form-control" value={nome} onChange={e => setNome(e.target.value)} placeholder="Nome Completo" />
            <input className="form-control" value={empresa} onChange={e => setEmpresa(e.target.value)} placeholder="Empresa" />
            <select className="form-control" value={perfil} onChange={e => setPerfil(e.target.value)}>
                <option value="EXECUTOR">Motorista (App)</option>
                <option value="ADMIN">Administrador (Web)</option>
            </select>
            <button onClick={gerarCredenciais} className="btn btn-primary" style={{width: '100%', justifyContent: 'center'}}>
                <RefreshCw size={18} /> Gerar Acesso
            </button>
        </div>

        <div className="card" style={{ background: '#f8f9fa', border: '2px dashed #ddd', textAlign:'center' }}>
            <h3 style={{ marginBottom: '20px', color: '#666' }}>2. Credenciais</h3>
            {emailGerado ? (
                <div>
                    <p style={{fontSize:'12px', textTransform:'uppercase', color:'#999'}}>Login</p>
                    <h3 style={{color:'#0056b3', margin:'0 0 15px 0'}}>{emailGerado}</h3>
                    <p style={{fontSize:'12px', textTransform:'uppercase', color:'#999'}}>Senha</p>
                    <h3 style={{color:'#28a745', margin:'0 0 20px 0'}}>{senhaGerada}</h3>
                    <button onClick={salvarUsuario} disabled={loading} className="btn btn-success" style={{width: '100%', justifyContent: 'center'}}>
                        <CheckCircle size={18} /> {loading ? 'Salvando...' : 'Confirmar'}
                    </button>
                </div>
            ) : <p style={{color:'#aaa', marginTop:'30px'}}>Preencha os dados para gerar.</p>}
        </div>
      </div>
    </div>
  );
}