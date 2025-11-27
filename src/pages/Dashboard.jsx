// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, Droplet, AlertTriangle } from 'lucide-react';

export default function Dashboard() {
  const [abastecimentos, setAbastecimentos] = useState([]);
  const API_URL = import.meta.env.VITE_API_URL || 'https://sga-api-ovqp.onrender.com';
  const token = localStorage.getItem('sga_token');

  useEffect(() => {
    axios.get(`${API_URL}/abastecimentos/`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setAbastecimentos(res.data))
      .catch(console.error);
  }, []);

  const totalGasto = abastecimentos
    .filter(a => a.status !== 'REPROVADO')
    .reduce((acc, curr) => acc + curr.valor_total, 0);

  const totalLitros = abastecimentos
    .filter(a => a.status !== 'REPROVADO')
    .reduce((acc, curr) => acc + (curr.litros || 0), 0);

  const pendentes = abastecimentos.filter(a => a.status === 'PENDENTE_VALIDACAO').length;
  const aprovados = abastecimentos.filter(a => a.status === 'APROVADO').length;
  const reprovados = abastecimentos.filter(a => a.status === 'REPROVADO').length;

  const dadosGrafico = [
    { name: 'Aprovados', valor: aprovados },
    { name: 'Pendentes', valor: pendentes },
    { name: 'Reprovados', valor: reprovados },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
            <h1 className="page-title">Visão Geral</h1>
            <p className="page-subtitle">Indicadores da operação em tempo real.</p>
        </div>
      </div>

      <div className="grid-kpi">
        <div className="card" style={{ borderLeft: '5px solid #28a745', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div>
                <p style={{ color: '#666', fontSize: '13px', fontWeight: 'bold', textTransform: 'uppercase' }}>Total Gasto</p>
                <h2 style={{ fontSize: '28px', margin: '5px 0 0 0', color: '#333' }}>
                    {totalGasto.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </h2>
            </div>
            <div style={{ background: '#d4edda', padding: '15px', borderRadius: '50%' }}><DollarSign color="#155724" size={24} /></div>
        </div>

        <div className="card" style={{ borderLeft: '5px solid #0056b3', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div>
                <p style={{ color: '#666', fontSize: '13px', fontWeight: 'bold', textTransform: 'uppercase' }}>Litros</p>
                <h2 style={{ fontSize: '28px', margin: '5px 0 0 0', color: '#333' }}>{totalLitros.toFixed(0)} L</h2>
            </div>
            <div style={{ background: '#cce5ff', padding: '15px', borderRadius: '50%' }}><Droplet color="#004085" size={24} /></div>
        </div>

        <div className="card" style={{ borderLeft: '5px solid #ffc107', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div>
                <p style={{ color: '#666', fontSize: '13px', fontWeight: 'bold', textTransform: 'uppercase' }}>Pendentes</p>
                <h2 style={{ fontSize: '28px', margin: '5px 0 0 0', color: '#333' }}>{pendentes}</h2>
            </div>
            <div style={{ background: '#fff3cd', padding: '15px', borderRadius: '50%' }}><AlertTriangle color="#856404" size={24} /></div>
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: '20px', fontSize: '18px' }}>Volume por Status</h3>
        <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dadosGrafico}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip cursor={{fill: '#f4f7fa'}} />
                    <Bar dataKey="valor" fill="#0056b3" radius={[4, 4, 0, 0]} barSize={60} />
                </BarChart>
            </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}