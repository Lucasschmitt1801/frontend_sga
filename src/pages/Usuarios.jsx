import React, { useState, useEffect } from 'react';
import { UserPlus, RefreshCw, CheckCircle, Trash2, Edit, Save, X } from 'lucide-react';
import axios from 'axios';

export default function Usuarios() {
  // Estados do Formulário
  const [idEditando, setIdEditando] = useState(null);
  const [nome, setNome] = useState('');
  const [empresa, setEmpresa] = useState('SGA');
  const [perfil, setPerfil] = useState('COLABORADOR');
  const [cargo, setCargo] = useState('');
  const [setor, setSetor] = useState('');
  
  // Credenciais
  const [emailGerado, setEmailGerado] = useState('');
  const [senhaGerada, setSenhaGerada] = useState('');
  
  // Listas da Tabela e Selects
  const [listaUsuarios, setListaUsuarios] = useState([]);
  const [listaSetores, setListaSetores] = useState([]); // Agora é dinâmico
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'https://sga-api-ovqp.onrender.com';
  const token = localStorage.getItem('sga_token');

  // --- 1. CARREGAR DADOS INICIAIS (USUÁRIOS E SETORES) ---
  useEffect(() => {
    carregarUsuarios();
    carregarSetores();
  }, []);

  const carregarUsuarios = () => {
    axios.get(`${API_URL}/usuarios/`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
          if(Array.isArray(res.data)) setListaUsuarios(res.data);
      })
      .catch(err => console.error("Erro ao listar usuários:", err));
  };

  const carregarSetores = () => {
    axios.get(`${API_URL}/setores/`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
          if(Array.isArray(res.data)) setListaSetores(res.data);
      })
      .catch(err => console.error("Erro ao listar setores:", err));
  };

  // --- 2. GERAR LOGIN AUTOMÁTICO ---
  const gerarCredenciais = () => {
    if (!nome) return alert("Preencha o nome do colaborador.");
    const nomes = nome.toLowerCase().trim().split(' ');
    const primeiro = nomes[0];
    const ultimo = nomes.length > 1 ? nomes[nomes.length - 1] : '';
    
    // Email: nome.sobrenome@empresa.com
    const emailFinal = `${primeiro}.${ultimo}@${empresa.toLowerCase().replace(/\s/g, '')}.com`.replace('..', '.');
    // Senha: Nome@2025
    const senhaFinal = `${primeiro.charAt(0).toUpperCase() + primeiro.slice(1)}@2025`;

    setEmailGerado(emailFinal);
    setSenhaGerada(senhaFinal);
  };

  // --- 3. SALVAR (CRIAR OU EDITAR) ---
  const salvarUsuario = async () => {
    if (!emailGerado && !idEditando) return alert("Gere as credenciais antes de salvar.");
    
    setLoading(true);
    try {
        const payload = { 
            nome, 
            email: emailGerado, 
            senha: senhaGerada || "SenhaMantida123", 
            perfil, 
            cargo, 
            setor 
        };
        
        if (idEditando) {
            await axios.put(`${API_URL}/usuarios/${idEditando}`, payload, { 
                headers: { Authorization: `Bearer ${token}` } 
            });
            alert("Colaborador atualizado com sucesso!");
        } else {
            await axios.post(`${API_URL}/usuarios/`, payload, { 
                headers: { Authorization: `Bearer ${token}` } 
            });
            alert(`Sucesso! Login: ${emailGerado}`);
        }

        limparFormulario();
        carregarUsuarios(); 

    } catch (error) {
        alert("Erro ao salvar. Verifique se o email já existe.");
    } finally {
        setLoading(false);
    }
  };

  // --- 4. EXCLUIR ---
  const excluirUsuario = async (id) => {
    if (confirm("Tem certeza que deseja EXCLUIR este colaborador?")) {
        try {
            await axios.delete(`${API_URL}/usuarios/${id}`, { 
                headers: { Authorization: `Bearer ${token}` } 
            });
            carregarUsuarios();
        } catch {
            alert("Erro ao excluir.");
        }
    }
  };

  // --- 5. PREPARAR EDIÇÃO ---
  const iniciarEdicao = (usuario) => {
    setIdEditando(usuario.id);
    setNome(usuario.nome || "");
    setEmailGerado(usuario.email);
    setPerfil(usuario.perfil);
    setCargo(usuario.cargo || "");
    setSetor(usuario.setor || "");
    setSenhaGerada(""); 
    
    // Rola para o topo para editar
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const limparFormulario = () => {
    setIdEditando(null);
    setNome(''); setCargo(''); setSetor(''); setEmailGerado(''); setSenhaGerada('');
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Cadastros</h1>
        <p className="page-subtitle">Controle total de acessos da equipe.</p>
      </div>

      <div className="grid-dashboard" style={{ gridTemplateColumns: '1fr 1.5fr', alignItems: 'start' }}>
        
        {/* ESQUERDA: FORMULÁRIO */}
        <div className="card">
            <div style={{display:'flex', justifyContent:'space-between', marginBottom:'20px'}}>
                <h3 style={{margin:0}}>{idEditando ? '✏️ Editando' : '➕ Novo Cadastro'}</h3>
                {idEditando && <button onClick={limparFormulario} className="btn" style={{padding:'5px'}}><X size={16}/></button>}
            </div>
            
            <div className="form-group">
                <label>Nome Completo</label>
                <input className="form-control" value={nome} onChange={e => setNome(e.target.value)} placeholder="Ex: Pedro Almeida" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div className="form-group">
                    <label>Cargo</label>
                    <input className="form-control" value={cargo} onChange={e => setCargo(e.target.value)} placeholder="Motorista" />
                </div>
                
                {/* SELECT DE SETORES AGORA É DINÂMICO */}
                <div className="form-group">
                    <label>Setor</label>
                    <select className="form-control" value={setor} onChange={e => setSetor(e.target.value)}>
                        <option value="">Selecione...</option>
                        {listaSetores.length > 0 ? (
                            listaSetores.map(s => (
                                <option key={s.id} value={s.nome}>{s.nome}</option>
                            ))
                        ) : (
                            <option disabled>Nenhum setor cadastrado</option>
                        )}
                    </select>
                </div>
            </div>

            <div className="form-group">
                <label>Nível de Acesso</label>
                <select className="form-control" value={perfil} onChange={e => setPerfil(e.target.value)}>
                    <option value="COLABORADOR">Colaborador (App)</option>
                    <option value="GERENTE">Gerente (Web)</option>
                    <option value="ADMIN">Administrador (Total)</option>
                </select>
            </div>

            {!idEditando && (
                <button onClick={gerarCredenciais} className="btn btn-primary" style={{width: '100%', marginBottom:'15px'}}>
                    <RefreshCw size={18} /> Gerar Acesso Automático
                </button>
            )}

            {(emailGerado || idEditando) && (
                <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px', border: '1px solid #eee' }}>
                    <label style={{fontSize:'12px', color:'#999'}}>LOGIN</label>
                    <input className="form-control" value={emailGerado} onChange={e => setEmailGerado(e.target.value)} disabled={idEditando} />
                    
                    {!idEditando && (
                        <>
                            <label style={{fontSize:'12px', color:'#999'}}>SENHA INICIAL</label>
                            <div style={{fontWeight:'bold', color:'#28a745', fontSize:'18px', marginBottom:'15px'}}>{senhaGerada}</div>
                        </>
                    )}

                    <button onClick={salvarUsuario} disabled={loading} className="btn btn-success" style={{width: '100%'}}>
                        <Save size={18} /> {idEditando ? 'Salvar Alterações' : 'Confirmar Cadastro'}
                    </button>
                </div>
            )}
        </div>

        {/* DIREITA: TABELA DE USUÁRIOS */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '20px', borderBottom: '1px solid #eee', background: '#f8f9fa' }}>
                <h3 style={{ margin: 0, fontSize:'16px' }}>📋 Lista de Colaboradores</h3>
            </div>
            
            <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
                <table style={{ width: '100%' }}>
                    <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                        <tr>
                            <th style={{width:'40%'}}>Nome / Email</th>
                            <th>Perfil / Setor</th>
                            <th style={{textAlign:'center'}}>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {listaUsuarios.map((u, index) => (
                            <tr key={index}>
                                <td>
                                    <div style={{ fontWeight: 'bold' }}>{u.nome || "Sem Nome"}</div>
                                    <div style={{ fontSize: '12px', color: '#999' }}>{u.email}</div>
                                </td>
                                <td>
                                    <span style={{ 
                                        fontSize: '10px', padding: '4px 8px', borderRadius: '10px', fontWeight: 'bold',
                                        background: u.perfil === 'ADMIN' ? '#e3f2fd' : '#fff3cd',
                                        color: u.perfil === 'ADMIN' ? '#0056b3' : '#856404'
                                    }}>
                                        {u.perfil}
                                    </span>
                                    {u.setor && (
                                        <div style={{fontSize:'11px', color:'#666', marginTop:'4px'}}>
                                            Setor: {u.setor}
                                        </div>
                                    )}
                                </td>
                                <td style={{ textAlign: 'center' }}>
                                    <button onClick={() => iniciarEdicao(u)} className="btn" style={{ padding: '6px', color: '#0056b3' }} title="Editar">
                                        <Edit size={18} />
                                    </button>
                                    <button onClick={() => excluirUsuario(u.id)} className="btn" style={{ padding: '6px', color: '#dc3545' }} title="Excluir">
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {listaUsuarios.length === 0 && (
                            <tr><td colSpan="3" style={{textAlign:'center', padding:'30px', color:'#999'}}>Nenhum usuário encontrado.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>

      </div>
    </div>
  );
}