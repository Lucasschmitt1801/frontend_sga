import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Check, X, MapPin, Image } from 'lucide-react';

export default function Abastecimentos() {
  const [dados, setDados] = useState([]);
  const [filtroStatus, setFiltroStatus] = useState('TODOS');
  
  const API_URL = import.meta.env.VITE_API_URL || 'https://sga-api-ovqp.onrender.com';
  const token = localStorage.getItem('sga_token');

  // 1. Carregar Dados da API
  const carregar = () => {
    axios.get(`${API_URL}/abastecimentos/`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setDados(res.data))
      .catch(err => console.error("Erro ao carregar:", err));
  };

  useEffect(() => { carregar(); }, []);

  // 2. Função de Aprovar/Reprovar
  const revisar = async (id, status) => {
    const motivo = status === 'REPROVADO' ? prompt("Motivo da reprovação:") : null;
    if (status === 'REPROVADO' && !motivo) return;
    
    try {
        await axios.patch(`${API_URL}/abastecimentos/${id}/revisar`, 
            { status, justificativa: motivo }, 
            { headers: { Authorization: `Bearer ${token}` } }
        );
        carregar(); // Recarrega a tabela para atualizar a cor
        alert(`Sucesso! Abastecimento ${status}.`);
    } catch { alert("Erro ao processar a revisão."); }
  };

  // 3. Filtro de Tabela
  const dadosFiltrados = dados.filter(item => {
    if (filtroStatus === 'TODOS') return true;
    return item.status === filtroStatus;
  });

  return (
    <div>
      <div className="page-header">
        <div>
            <h1 className="page-title">Auditoria</h1>
            <p className="page-subtitle">Aprovação e conferência de registros.</p>
        </div>
        
        {/* Seletor de Filtro */}
        <select 
            className="form-control" 
            style={{ width: '200px' }} 
            value={filtroStatus} 
            onChange={e => setFiltroStatus(e.target.value)}
        >
            <option value="TODOS">Todos</option>
            <option value="PENDENTE_VALIDACAO">Pendentes</option>
            <option value="APROVADO">Aprovados</option>
            <option value="REPROVADO">Reprovados</option>
        </select>
      </div>

      <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
        <table style={{ minWidth: '800px' }}>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Veículo</th>
                    <th>Valor</th>
                    <th>KM</th>
                    <th>Posto / Mapa</th>
                    <th>Status</th>
                    <th>Evidências</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>
                {dadosFiltrados.map(item => (
                    <tr key={item.id}>
                        <td style={{ color: '#666' }}>#{item.id}</td>
                        
                        {/* Coluna Veículo */}
                        <td style={{ fontWeight: '500' }}>
                            {item.veiculo ? `${item.veiculo.modelo} - ${item.veiculo.placa}` : `Carro ID ${item.id_veiculo}`}
                            <div style={{ fontSize: '11px', color: '#999' }}>User ID: {item.id_usuario}</div>
                        </td>
                        
                        <td style={{ fontWeight: 'bold', color: '#0056b3' }}>
                            R$ {item.valor_total.toFixed(2)}
                        </td>
                        
                        <td>{item.quilometragem ? `${item.quilometragem} km` : '-'}</td>
                        
                        {/* Coluna Mapa (Lógica do seu app antigo) */}
                        <td>
                            <div style={{fontSize: '13px'}}>{item.nome_posto || 'Não inf.'}</div>
                            {item.gps_lat && (
                                <a 
                                    href={`https://www.google.com/maps/search/?api=1&query=${item.gps_lat},${item.gps_long}`} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#0056b3', fontSize: '12px', marginTop: '4px', textDecoration:'none' }}
                                >
                                    <MapPin size={12}/> Ver Local
                                </a>
                            )}
                        </td>

                        {/* Status com Badge Colorido */}
                        <td>
                            <span className={`status-badge status-${item.status === 'PENDENTE_VALIDACAO' ? 'pendente' : item.status.toLowerCase()}`}>
                                {item.status === 'PENDENTE_VALIDACAO' ? 'PENDENTE' : item.status}
                            </span>
                            {item.justificativa_revisao && (
                                <div style={{ fontSize: '11px', color: '#dc3545', marginTop: '4px', maxWidth:'150px' }}>
                                    {item.justificativa_revisao}
                                </div>
                            )}
                        </td>

                        {/* Coluna Fotos (Links do Supabase) */}
                        <td>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                {item.fotos && item.fotos.length > 0 ? item.fotos.map(f => (
                                    <a 
                                        key={f.id} 
                                        href={`${API_URL.replace('/api', '')}${f.url_arquivo.startsWith('http') ? f.url_arquivo : '/fotos/'+f.url_arquivo}`} 
                                        // Nota: O backend novo já salva a URL completa do Supabase, então o href deve funcionar direto
                                        target="_blank" 
                                        title={f.tipo}
                                        style={{ color: '#666', transition: '0.2s' }}
                                        rel="noopener noreferrer"
                                    >
                                        <Image size={18} className="hover:text-blue-600" />
                                    </a>
                                )) : <span style={{fontSize:'12px', color:'#ccc'}}>S/ Foto</span>}
                            </div>
                        </td>

                        {/* Botões de Ação (Apenas se Pendente) */}
                        <td>
                            {item.status === 'PENDENTE_VALIDACAO' && (
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button 
                                        onClick={() => revisar(item.id, 'APROVADO')} 
                                        className="btn-success" 
                                        style={{ padding: '6px 10px' }}
                                        title="Aprovar"
                                    >
                                        <Check size={16}/>
                                    </button>
                                    <button 
                                        onClick={() => revisar(item.id, 'REPROVADO')} 
                                        className="btn-danger" 
                                        style={{ padding: '6px 10px' }}
                                        title="Reprovar"
                                    >
                                        <X size={16}/>
                                    </button>
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