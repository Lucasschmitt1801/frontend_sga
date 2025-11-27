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
        
        alert(`Sucesso! Usuário criado.\n\nLogin: ${emailGerado}\nSenha: ${senhaGerada}`);
        
        setNome('');
        setEmailGerado('');
        setSenhaGerada('');
    } catch (error) {
        console.error(error);
        alert("Erro ao criar usuário. O email pode já existir ou você não tem permissão de Admin.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
            <h1 className="page-title">Colaboradores</h1>
            <p className="page-subtitle">Cadastre motoristas para acesso ao App Mobile.</p>
        </div>
      </div>

      <div className="grid-dashboard">
        
        {/* Card Esquerdo: Formulário */}
        <div className="card">
            <h3 style={{ marginBottom: '20px' }}>1. Dados do Funcionário</h3>
            
            <div className="form-group">
                <label className="form-label">Nome Completo</label>
                <input className="form-control" value={nome} onChange={e => setNome(e.target.value)} placeholder="Ex: Carlos Silva" />
            </div>

            <div className="form-group">
                <label className="form-label">Empresa / Filial</label>
                <input className="form-control" value={empresa} onChange={e => setEmpresa(e.target.value)} />
            </div>

            <div className="form-group">
                <label className="form-label">Nível de Acesso</label>
                <select className="form-control" value={perfil} onChange={e => setPerfil(e.target.value)}>
                    <option value="EXECUTOR">Motorista (Acesso App Mobile)</option>
                    <option value="ADMIN">Administrador (Acesso Painel Web)</option>
                </select>
            </div>

            <button onClick={gerarCredenciais} className="btn btn-primary" style={{width: '100%', justifyContent: 'center'}}>
                <RefreshCw size={18} /> Gerar Login Automático
            </button>
        </div>

        {/* Card Direito: Resultado */}
        <div className="card" style={{ background: '#f8f9fa', border: '2px dashed #dee2e6' }}>
            <h3 style={{ marginBottom: '20px', color: '#666' }}>2. Credenciais Geradas</h3>
            
            {emailGerado ? (
                <div>
                    <div style={{ marginBottom: '15px' }}>
                        <span style={{ fontSize: '12px', textTransform: 'uppercase', color: '#999' }}>Login (Email)</span>
                        <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#0056b3' }}>{emailGerado}</div>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <span style={{ fontSize: '12px', textTransform: 'uppercase', color: '#999' }}>Senha Inicial</span>
                        <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#28a745' }}>{senhaGerada}</div>
                    </div>

                    <button onClick={salvarUsuario} disabled={loading} className="btn btn-success" style={{width: '100%', justifyContent: 'center'}}>
                        <CheckCircle size={18} /> {loading ? 'Salvando...' : 'CONFIRMAR CADASTRO'}
                    </button>
                </div>
            ) : (
                <div style={{ textAlign: 'center', padding: '40px 0', color: '#aaa' }}>
                    <UserPlus size={40} />
                    <p>Preencha os dados ao lado e clique em "Gerar".</p>
                </div>
            )}
        </div>

      </div>
    </div>
  );
}