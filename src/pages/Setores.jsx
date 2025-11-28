import React, { useState, useEffect } from 'react';
import { Layers, Plus, Trash2, AlertCircle } from 'lucide-react';
import axios from 'axios';

export default function Setores() {
  const [setores, setSetores] = useState([]);
  const [novoSetor, setNovoSetor] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'https://sga-api-ovqp.onrender.com';
  const token = localStorage.getItem('sga_token');

  // --- CARREGAR ---
  const carregarSetores = () => {
    axios.get(`${API_URL}/setores/`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setSetores(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => { carregarSetores(); }, []);

  // --- ADICIONAR ---
  const adicionar = async () => {
    if (!novoSetor) return;
    setLoading(true);
    setErro('');

    try {
        await axios.post(`${API_URL}/setores/`, 
            { nome: novoSetor }, 
            { headers: { Authorization: `Bearer ${token}` } }
        );
        setNovoSetor('');
        carregarSetores(); 
    } catch (error) {
        if (error.response?.status === 400) {
            setErro("Este setor já existe.");
        } else {
            setErro("Erro ao criar. Verifique permissão de Admin.");
        }
    } finally {
        setLoading(false);
    }
  };

  // --- REMOVER ---
  const remover = async (id) => {
    if (!confirm("Tem certeza?")) return;
    
    try {
        await axios.delete(`${API_URL}/setores/${id}`, { 
            headers: { Authorization: `Bearer ${token}` } 
        });
        carregarSetores();
    } catch (error) {
        alert("Erro ao excluir. Apenas Admins podem apagar.");
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Gestão de Setores</h1>
        <p className="page-subtitle">Organize a empresa por departamentos.</p>
      </div>

      <div className="grid-dashboard" style={{ gridTemplateColumns: '1fr 1fr' }}>
        
        {/* LISTA */}
        <div className="card">
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px'}}>
                <h3 style={{margin:0}}>🏢 Setores Ativos</h3>
                <span style={{background:'#e3f2fd', color:'#0056b3', padding:'5px 10px', borderRadius:'15px', fontSize:'12px', fontWeight:'bold'}}>
                    {setores.length} Total
                </span>
            </div>

            {setores.length === 0 ? (
                <div style={{textAlign:'center', color:'#999', padding:'20px'}}>
                    Nenhum setor cadastrado.
                </div>
            ) : (
                <table style={{width:'100%'}}>
                    <thead>
                        <tr>
                            <th style={{textAlign:'left', padding:'10px'}}>Nome</th>
                            <th style={{textAlign:'center', padding:'10px'}}>Ação</th>
                        </tr>
                    </thead>
                    <tbody>
                        {setores.map(s => (
                            <tr key={s.id} style={{borderBottom:'1px solid #eee'}}>
                                <td style={{padding:'10px', fontWeight:'500'}}>{s.nome}</td>
                                <td style={{textAlign:'center'}}>
                                    <button onClick={() => remover(s.id)} className="btn" style={{padding:'5px', color:'#dc3545', background:'none'}}>
                                        <Trash2 size={18}/>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>

        {/* FORMULÁRIO */}
        <div className="card" style={{height: 'fit-content'}}>
            <h3 style={{marginBottom:'20px'}}>➕ Novo Setor</h3>
            
            <div className="form-group">
                <label>Nome do Departamento</label>
                <input 
                    className="form-control" 
                    value={novoSetor} 
                    onChange={e => setNovoSetor(e.target.value)} 
                    placeholder="Ex: Logística, Comercial..." 
                />
            </div>

            {erro && (
                <div style={{color:'#dc3545', fontSize:'13px', display:'flex', alignItems:'center', gap:'5px', marginBottom:'15px'}}>
                    <AlertCircle size={16}/> {erro}
                </div>
            )}

            <button onClick={adicionar} disabled={loading || !novoSetor} className="btn btn-success" style={{width:'100%', justifyContent:'center'}}>
                <Plus size={18}/> {loading ? 'Salvando...' : 'Adicionar Setor'}
            </button>
        </div>

      </div>
    </div>
  );
}