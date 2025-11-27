// src/pages/Abastecimentos.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Check, X, MapPin, Image } from 'lucide-react';

export default function Abastecimentos() {
  const [dados, setDados] = useState([]);
  const [filtroStatus, setFiltroStatus] = useState('TODOS');
  
  const API_URL = import.meta.env.VITE_API_URL || 'https://sga-api-ovqp.onrender.com';
  const token = localStorage.getItem('sga_token');

  const carregar = () => {
    axios.get(`${API_URL}/abastecimentos/`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setDados(res.data))
      .catch(console.error);
  };

  useEffect(() => { carregar(); }, []);

  const revisar = async (id, status) => {
    const motivo = status === 'REPROVADO' ? prompt("Motivo da reprovação:") : null;
    if (status === 'REPROVADO' && !motivo) return;
    try {
        await axios.patch(`${API_URL}/abastecimentos/${id}/revisar`, { status, justificativa: motivo }, { headers: { Authorization: `Bearer ${token}` } });
        carregar();
        alert(`Sucesso: ${status}`);
    } catch { alert("Erro ao processar"); }
  };

  const dadosFiltrados = dados.filter(item => filtroStatus === 'TODOS' ? true : item.status === filtroStatus);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Auditoria</h1>
        <select className="form-control" style={{ width: '200px', margin: 0 }} value={filtroStatus} onChange={e => setFiltroStatus(e.target.value)}>
            <option value="TODOS">Todos</option>
            <option value="PENDENTE_VALIDACAO">Pendentes</option>
            <option value="APROVADO">Aprovados</option>
            <option value="REPROVADO">Reprovados</option>
        </select>
      </div>

      <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Veículo</th>
                    <th>Valor</th>
                    <th>KM</th>
                    <th>Local</th>
                    <th>Status</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>
                {dadosFiltrados.map(item => (
                    <tr key={item.id}>
                        <td>#{item.id}</td>
                        <td>
                            {item.veiculo ? item.veiculo.modelo : `ID ${item.id_veiculo}`}
                            <div style={{ fontSize: '12px', color: '#999' }}>{item.veiculo?.placa}</div>
                        </td>
                        <td style={{ fontWeight: 'bold', color: '#0056b3' }}>R$ {item.valor_total.toFixed(2)}</td>
                        <td>{item.quilometragem ? `${item.quilometragem} km` : '-'}</td>
                        <td>
                            {item.gps_lat ? (
                                <a href={`https://maps.google.com/?q=${item.gps_lat},${item.gps_long}`} target="_blank" className="btn-primary" style={{ padding: '4px 8px', fontSize: '11px', textDecoration: 'none', borderRadius: '4px' }}>
                                    <MapPin size={12}/> Ver
                                </a>
                            ) : '-'}
                        </td>
                        <td>
                            <span className={`status-badge status-${item.status === 'PENDENTE_VALIDACAO' ? 'pendente' : item.status.toLowerCase()}`}>
                                {item.status.replace('_', ' ')}
                            </span>
                        </td>
                        <td>
                            {item.status === 'PENDENTE_VALIDACAO' && (
                                <div style={{ display: 'flex', gap: '5px' }}>
                                    <button onClick={() => revisar(item.id, 'APROVADO')} className="btn-success" style={{ padding: '6px' }} title="Aprovar"><Check size={16}/></button>
                                    <button onClick={() => revisar(item.id, 'REPROVADO')} className="btn-danger" style={{ padding: '6px' }} title="Reprovar"><X size={16}/></button>
                                </div>
                            )}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>
    </div>
  );
}