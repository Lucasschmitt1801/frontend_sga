import React, { useState, useEffect } from 'react';
import { Car, Plus, Trash2, Edit, AlertCircle } from 'lucide-react';
import axios from 'axios';

export default function Veiculos() {
  const [veiculos, setVeiculos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editandoId, setEditandoId] = useState(null);

  // Estados do Formulário
  const [placa, setPlaca] = useState('');
  const [modelo, setModelo] = useState('');
  const [fabricante, setFabricante] = useState('');
  const [ano, setAno] = useState('');
  const [cor, setCor] = useState('');
  const [chassi, setChassi] = useState('');
  const [status, setStatus] = useState('ESTOQUE');

  const API_URL = import.meta.env.VITE_API_URL || 'https://sga-api-ovqp.onrender.com';
  const token = localStorage.getItem('sga_token');

  const carregarVeiculos = () => {
    axios.get(`${API_URL}/veiculos/`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setVeiculos(res.data))
      .catch(console.error);
  };

  useEffect(() => { carregarVeiculos(); }, []);

  const salvarVeiculo = async () => {
    if (!placa || !modelo) return alert("Preencha placa e modelo.");
    setLoading(true);
    
    // Tratamento de dados para evitar erros de banco
    const payload = { 
        placa: placa.toUpperCase().trim(), 
        modelo: modelo.trim(), 
        fabricante: fabricante ? fabricante.trim() : null, 
        ano_fabricacao: ano ? parseInt(ano) : null, 
        cor: cor ? cor.trim() : null, 
        chassi: chassi ? chassi.trim() : null, // Envia NULL se estiver vazio
        status 
    };

    try {
        if (editandoId) {
            await axios.put(`${API_URL}/veiculos/${editandoId}`, payload, { headers: { Authorization: `Bearer ${token}` } });
            alert("Veículo atualizado com sucesso!");
        } else {
            await axios.post(`${API_URL}/veiculos/`, payload, { headers: { Authorization: `Bearer ${token}` } });
            alert("Veículo cadastrado com sucesso!");
        }
        limparForm();
        carregarVeiculos();
    } catch (error) {
        console.error(error);
        // Mostra a mensagem real do erro vinda do servidor
        const msg = error.response?.data?.detail || "Erro ao salvar. Verifique a placa ou chassi.";
        alert(`Erro: ${msg}`);
    } finally {
        setLoading(false);
    }
  };

  const editar = (v) => {
    setEditandoId(v.id);
    setPlaca(v.placa);
    setModelo(v.modelo);
    setFabricante(v.fabricante || '');
    setAno(v.ano_fabricacao || '');
    setCor(v.cor || '');
    setChassi(v.chassi || '');
    setStatus(v.status);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const excluir = async (id) => {
    if (confirm("Excluir este veículo permanentemente?")) {
        try {
            await axios.delete(`${API_URL}/veiculos/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            carregarVeiculos();
        } catch (error) {
            alert("Erro ao excluir. Verifique se há abastecimentos vinculados.");
        }
    }
  };

  const limparForm = () => {
    setEditandoId(null);
    setPlaca(''); setModelo(''); setFabricante(''); setAno(''); setCor(''); setChassi(''); setStatus('ESTOQUE');
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Gestão de Veículos</h1>
        <p className="page-subtitle">Cadastre e gerencie a frota.</p>
      </div>

      <div className="grid-dashboard" style={{ gridTemplateColumns: '1fr 2fr', gap: '30px' }}>
        
        {/* FORMULÁRIO */}
        <div className="card">
            <h3 style={{marginBottom:'20px', color: '#0056b3'}}>
                {editandoId ? '✏️ Editar Veículo' : '🚗 Novo Veículo'}
            </h3>
            
            <div className="form-group">
                <label>Placa *</label>
                <input 
                    className="form-control" 
                    value={placa} 
                    onChange={e => setPlaca(e.target.value.toUpperCase())} 
                    placeholder="ABC-1234" 
                    maxLength={8} 
                />
            </div>
            
            <div className="form-group">
                <label>Modelo *</label>
                <input className="form-control" value={modelo} onChange={e => setModelo(e.target.value)} placeholder="Ex: Fiat Siena" />
            </div>
            
            <div style={{display:'flex', gap:'15px'}}>
                <div className="form-group" style={{flex:1}}>
                    <label>Fabricante</label>
                    <input className="form-control" value={fabricante} onChange={e => setFabricante(e.target.value)} placeholder="Fiat" />
                </div>
                <div className="form-group" style={{flex:1}}>
                    <label>Ano</label>
                    <input className="form-control" value={ano} onChange={e => setAno(e.target.value)} placeholder="2007" type="number" />
                </div>
            </div>
            
            <div className="form-group">
                <label>Cor</label>
                <input className="form-control" value={cor} onChange={e => setCor(e.target.value)} placeholder="Cinza" />
            </div>

            <div className="form-group">
                <label>Chassi (Opcional)</label>
                <input className="form-control" value={chassi} onChange={e => setChassi(e.target.value)} placeholder="XYZ..." />
            </div>
            
            <div className="form-group">
                <label>Status</label>
                <select className="form-control" value={status} onChange={e => setStatus(e.target.value)}>
                    <option value="ESTOQUE">✅ Em Estoque</option>
                    <option value="VENDIDO">💲 Vendido (Bloqueia Abastecimento)</option>
                    <option value="MANUTENCAO">🔧 Manutenção</option>
                </select>
                {status === 'VENDIDO' && (
                    <div style={{fontSize:'12px', color:'#dc3545', display:'flex', alignItems:'center', gap:'5px', marginTop:'5px'}}>
                        <AlertCircle size={14}/> Atenção: Será excluído em 48h.
                    </div>
                )}
            </div>

            <button onClick={salvarVeiculo} disabled={loading} className="btn btn-primary" style={{width:'100%', justifyContent:'center', marginTop:'10px'}}>
                {loading ? 'Salvando...' : (editandoId ? 'Salvar Alterações' : 'Cadastrar Veículo')}
            </button>
            
            {editandoId && (
                <button onClick={limparForm} className="btn" style={{marginTop:'10px', width:'100%', justifyContent:'center', color:'#666', background:'#f0f0f0'}}>
                    Cancelar Edição
                </button>
            )}
        </div>

        {/* LISTA DE VEÍCULOS */}
        <div className="card" style={{padding:0, overflow:'hidden'}}>
            <div style={{padding:'20px', background:'#f8f9fa', borderBottom:'1px solid #eee'}}>
                <h3 style={{margin:0, fontSize:'16px'}}>📋 Frota Atual</h3>
            </div>
            
            <div style={{maxHeight:'600px', overflowY:'auto'}}>
                <table style={{width:'100%'}}>
                    <thead style={{position:'sticky', top:0, background:'#fff', zIndex:1}}>
                        <tr>
                            <th>Veículo</th>
                            <th>Detalhes</th>
                            <th>Status</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {veiculos.map(v => (
                            <tr key={v.id}>
                                <td>
                                    <div style={{fontWeight:'bold', color:'#0056b3', fontSize:'15px'}}>{v.placa}</div>
                                    <div style={{fontWeight:'500'}}>{v.modelo}</div>
                                </td>
                                <td style={{fontSize:'13px', color:'#666'}}>
                                    {[v.fabricante, v.ano_fabricacao, v.cor].filter(Boolean).join(' • ')}
                                </td>
                                <td>
                                    <span className={`status-badge ${v.status === 'VENDIDO' ? 'status-reprovado' : v.status === 'MANUTENCAO' ? 'status-pendente' : 'status-aprovado'}`}>
                                        {v.status}
                                    </span>
                                </td>
                                <td>
                                    <div style={{display:'flex', gap:'5px'}}>
                                        <button onClick={() => editar(v)} className="btn" style={{padding:'6px', color:'#0056b3', background:'#e3f2fd'}} title="Editar">
                                            <Edit size={16}/>
                                        </button>
                                        <button onClick={() => excluir(v.id)} className="btn" style={{padding:'6px', color:'#dc3545', background:'#f8d7da'}} title="Excluir">
                                            <Trash2 size={16}/>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {veiculos.length === 0 && (
                            <tr>
                                <td colSpan="4" style={{textAlign:'center', padding:'30px', color:'#999'}}>
                                    Nenhum veículo encontrado.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>

      </div>
    </div>
  );
}