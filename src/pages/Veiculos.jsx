import React, { useState, useEffect } from 'react';
import { Car, Plus, Trash2, Edit } from 'lucide-react';
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
    
    const payload = { 
        placa: placa.toUpperCase(), 
        modelo, 
        fabricante, 
        ano_fabricacao: parseInt(ano) || 2024, 
        cor, 
        chassi,
        status 
    };

    try {
        if (editandoId) {
            await axios.put(`${API_URL}/veiculos/${editandoId}`, payload, { headers: { Authorization: `Bearer ${token}` } });
            alert("Veículo atualizado!");
        } else {
            await axios.post(`${API_URL}/veiculos/`, payload, { headers: { Authorization: `Bearer ${token}` } });
            alert("Veículo cadastrado!");
        }
        limparForm();
        carregarVeiculos();
    } catch (e) {
        alert("Erro ao salvar. Verifique se a placa já existe.");
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
        await axios.delete(`${API_URL}/veiculos/${id}`, { headers: { Authorization: `Bearer ${token}` } });
        carregarVeiculos();
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
      </div>

      <div className="grid-dashboard" style={{ gridTemplateColumns: '1fr 2fr' }}>
        
        {/* FORMULÁRIO */}
        <div className="card">
            <h3 style={{marginBottom:'20px'}}>{editandoId ? '✏️ Editar Veículo' : '🚗 Novo Veículo'}</h3>
            
            <div className="form-group">
                <label>Placa</label>
                <input className="form-control" value={placa} onChange={e => setPlaca(e.target.value)} placeholder="ABC-1234" maxLength={8} />
            </div>
            
            <div className="form-group">
                <label>Modelo</label>
                <input className="form-control" value={modelo} onChange={e => setModelo(e.target.value)} placeholder="Ex: Gol 1.0" />
            </div>
            
            <div style={{display:'flex', gap:'10px'}}>
                <div className="form-group" style={{flex:1}}>
                    <label>Fabricante</label>
                    <input className="form-control" value={fabricante} onChange={e => setFabricante(e.target.value)} placeholder="VW" />
                </div>
                <div className="form-group" style={{flex:1}}>
                    <label>Ano</label>
                    <input className="form-control" value={ano} onChange={e => setAno(e.target.value)} placeholder="2024" type="number" />
                </div>
            </div>
            
            <div className="form-group">
                <label>Cor</label>
                <input className="form-control" value={cor} onChange={e => setCor(e.target.value)} placeholder="Branco" />
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
                {status === 'VENDIDO' && <small style={{color:'red', display:'block', marginTop:'5px'}}>* Veículo será apagado automaticamente em 48h.</small>}
            </div>

            <button onClick={salvarVeiculo} disabled={loading} className="btn btn-primary" style={{width:'100%', justifyContent:'center'}}>
                {loading ? 'Salvando...' : (editandoId ? 'Salvar Alterações' : 'Cadastrar Veículo')}
            </button>
            
            {editandoId && <button onClick={limparForm} className="btn" style={{marginTop:'10px', width:'100%', justifyContent:'center', color:'#666'}}>Cancelar</button>}
        </div>

        {/* LISTA DE VEÍCULOS */}
        <div className="card" style={{padding:0, overflow:'hidden'}}>
            <table style={{width:'100%'}}>
                <thead>
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
                                <div style={{fontWeight:'bold', color:'#0056b3'}}>{v.placa}</div>
                                <div>{v.modelo}</div>
                            </td>
                            <td style={{fontSize:'13px', color:'#666'}}>
                                {v.fabricante} • {v.ano_fabricacao} • {v.cor}
                            </td>
                            <td>
                                <span className={`status-badge ${v.status === 'VENDIDO' ? 'status-reprovado' : 'status-aprovado'}`}>
                                    {v.status}
                                </span>
                            </td>
                            <td>
                                <button onClick={() => editar(v)} className="btn" style={{padding:'5px', color:'#0056b3'}}><Edit size={18}/></button>
                                <button onClick={() => excluir(v.id)} className="btn" style={{padding:'5px', color:'#dc3545'}}><Trash2 size={18}/></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

      </div>
    </div>
  );
}