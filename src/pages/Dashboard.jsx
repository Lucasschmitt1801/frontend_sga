import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
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

  const totalGasto = abastecimentos.filter(a => a.status !== 'REPROVADO').reduce((acc, curr) => acc + curr.valor_total, 0);
  const totalLitros = abastecimentos.filter(a => a.status !== 'REPROVADO').reduce((acc, curr) => acc + (curr.litros || 0), 0);
  const pendentes = abastecimentos.filter(a => a.status === 'PENDENTE_VALIDACAO').length;

  const dadosDiarios = [
    { dia: 'Seg', valor: 1200 }, { dia: 'Ter', valor: 1800 },
    { dia: 'Qua', valor: 900 }, { dia: 'Qui', valor: 2100 },
    { dia: 'Sex', valor: 2400 }, { dia: 'Sáb', valor: 800 }, { dia: 'Dom', valor: 0 },
  ];

  const dadosSetor = [
    { name: 'Logística', value: 5400 },
    { name: 'Comercial', value: 3200 },
    { name: 'Operacional', value: 8100 },
  ];
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Visão Geral</h1>
      </div>

      <div className="grid-kpi">
        <div className="card" style={{ borderLeft: '5px solid #28a745', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div><p style={{color:'#666', fontSize:'12px', fontWeight:'bold'}}>TOTAL GASTO</p><h2>{totalGasto.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</h2></div>
            <div style={{background:'#d4edda', padding:'15px', borderRadius:'50%'}}><DollarSign color="#155724"/></div>
        </div>
        <div className="card" style={{ borderLeft: '5px solid #0056b3', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div><p style={{color:'#666', fontSize:'12px', fontWeight:'bold'}}>LITROS</p><h2>{totalLitros.toFixed(0)} L</h2></div>
            <div style={{background:'#cce5ff', padding:'15px', borderRadius:'50%'}}><Droplet color="#004085"/></div>
        </div>
        <div className="card" style={{ borderLeft: '5px solid #ffc107', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div><p style={{color:'#666', fontSize:'12px', fontWeight:'bold'}}>PENDENTES</p><h2>{pendentes}</h2></div>
            <div style={{background:'#fff3cd', padding:'15px', borderRadius:'50%'}}><AlertTriangle color="#856404"/></div>
        </div>
      </div>

      <div className="grid-dashboard">
        <div className="card">
            <h3 style={{marginBottom:'20px'}}>Abastecimento por Dia (R$)</h3>
            <div style={{ height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dadosDiarios}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="dia" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="valor" fill="#0056b3" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>

        <div className="card">
            <h3 style={{marginBottom:'20px'}}>Gasto por Setor</h3>
            <div style={{ height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie data={dadosSetor} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                            {dadosSetor.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
      </div>
    </div>
  );
}