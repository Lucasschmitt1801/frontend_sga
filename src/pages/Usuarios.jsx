import React, { useState } from 'react';
import { UserPlus, RefreshCw, CheckCircle } from 'lucide-react';
import axios from 'axios';

export default function Usuarios() {
  const [nome, setNome] = useState('');
  const [empresa, setEmpresa] = useState('SGA');
  const [perfil, setPerfil] = useState('COLABORADOR');
  const [cargo, setCargo] = useState('');
  const [setor, setSetor] = useState('');
  
  const [emailGerado, setEmailGerado] = useState('');
  const [senhaGerada, setSenhaGerada] = useState('');
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'https://sga-api-ovqp.onrender.com';
  const token = localStorage.getItem('sga_token');

  const listaSetores = ['Logística', 'Vendas', 'Operacional', 'TI', 'Diretoria'];

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
            { nome, email: emailGerado, senha: senhaGerada, perfil, cargo, setor }, 
            { headers: { Authorization: `Bearer ${token}` } }
        );
        alert(`Sucesso! Colaborador criado.\nLogin: ${emailGerado}\nSenha: ${senhaGerada}`);
        setNome(''); setCargo(''); setSetor(''); setEmailGerado(''); setSenhaGerada('');
    } catch {
        alert("Erro ao criar. Verifique se você é ADMIN.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Cadastros</h1>
        <p className="page-subtitle">Gerencie o acesso dos colaboradores ao sistema.</p>
      </div>

      <div className="grid-dashboard">
        <div className="card">
            <h3 style={{ marginBottom: '20px' }}>1. Dados do Colaborador</h3>
            
            <div className="form-group">
                <label>Nome Completo</label>
                <input className="form-control" value={nome} onChange={e => setNome(e.target.value)} placeholder="Ex: Pedro Almeida" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div className="form-group">
                    <label>Cargo</label>
                    <input className="form-control" value={cargo} onChange={e => setCargo(e.target.value)} placeholder="Ex: Motorista Sr" />
                </div>
                <div className="form-group">
                    <label>Setor</label>
                    <select className="form-control" value={setor} onChange={e => setSetor(e.target.value)}>
                        <option value="">Selecione...</option>
                        {listaSetores.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
            </div>

            <div className="form-group">
                <label>Nível de Acesso</label>
                <select className="form-control" value={perfil} onChange={e => setPerfil(e.target.value)}>
                    <option value="COLABORADOR">Colaborador (App Mobile)</option>
                    <option value="GERENTE">Gerente (Visualização Web)</option>
                    <option value="ADMIN">Administrador (Controle Total)</option>
                </select>
            </div>

            <button onClick={gerarCredenciais} className="btn btn-primary" style={{width: '100%'}}>
                <RefreshCw size={18} /> Gerar Acesso
            </button>
        </div>

        <div className="card" style={{ background: '#f8f9fa', border: '2px dashed #ddd', textAlign:'center' }}>
            <h3 style={{ marginBottom: '20px', color: '#666' }}>2. Credenciais</h3>
            {emailGerado ? (
                <div>
                    <p style={{fontSize:'12px', textTransform:'uppercase', color:'#999'}}>Login</p>
                    <h3 style={{color:'#0056b3', margin:'0 0 15px 0'}}>{emailGerado}</h3>
                    <p style={{fontSize:'12px', textTransform:'uppercase', color:'#999'}}>Senha Provisória</p>
                    <h3 style={{color:'#28a745', margin:'0 0 20px 0'}}>{senhaGerada}</h3>
                    <button onClick={salvarUsuario} disabled={loading} className="btn btn-success" style={{width: '100%'}}>
                        <CheckCircle size={18} /> {loading ? 'Salvando...' : 'Confirmar Cadastro'}
                    </button>
                </div>
            ) : <p style={{color:'#aaa', marginTop:'50px'}}>Preencha os dados ao lado.</p>}
        </div>
      </div>
    </div>
  );
}