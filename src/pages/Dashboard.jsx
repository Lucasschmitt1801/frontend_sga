import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { DollarSign, Droplet, AlertTriangle } from 'lucide-react';

export default function Dashboard() {
  const [abastecimentos, setAbastecimentos] = useState([]);
  const [usuarios, setUsuarios] = useState([]); // Busca usuários
  const [veiculos, setVeiculos] = useState([]); // Busca veículos
  const [setores, setSetores] = useState([]);   // Busca setores
  
  const API_URL = import.meta.env.VITE_API_URL || 'https://sga-api-ovqp.onrender.com';
  const token = localStorage.getItem('sga_token');

  // 1. CARREGAR TUDO EM PARALELO
  useEffect(() => {
    const fetchData = async () => {
        try {
            const [resAbs, resUsers, resSet, resVeic] = await Promise.all([
                axios.get(`${API_URL}/abastecimentos/`, { headers: { Authorization: `Bearer ${token}` } }),
                axios.get(`${API_URL}/usuarios/`, { headers: { Authorization: `Bearer ${token}` } }),
                axios.get(`${API_URL}/setores/`, { headers: { Authorization: `Bearer ${token}` } }),
                axios.get(`${API_URL}/veiculos/`, { headers: { Authorization: `Bearer ${token}` } })
            ]);
            setAbastecimentos(resAbs.data);
            setUsuarios(resUsers.data);
            setSetores(resSet.data);
            setVeiculos(resVeic.data);
        } catch (error) {
            console.error("Erro ao carregar dados:", error);
        }
    };
    fetchData();
  }, []);

  // 2. KPIs
  const totalGasto = abastecimentos.filter(a => a.status !== 'REPROVADO').reduce((acc, curr) => acc + curr.valor_total, 0);
  const totalLitros = abastecimentos.filter(a => a.status !== 'REPROVADO').reduce((acc, curr) => acc + (curr.litros || 0), 0);
  const pendentes = abastecimentos.filter(a => a.status === 'PENDENTE_VALIDACAO').length;

  // 3. GRÁFICO DIÁRIO
  const processarGraficoDiario = () => {
    const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const agrupado = { 'Dom': 0, 'Seg': 0, 'Ter': 0, 'Qua': 0, 'Qui': 0, 'Sex': 0, 'Sáb': 0 };

    abastecimentos.forEach(item => {
        if (item.status === 'REPROVADO') return;
        const data = new Date(item.data_hora);
        const dia = diasSemana[data.getDay()];
        if (agrupado[dia] !== undefined) agrupado[dia] += item.valor_total;
    });

    return Object.keys(agrupado).map(key => ({ dia: key, valor: agrupado[key] }));
  };

  // 4. GRÁFICO POR SETOR (Via Usuário)
  const processarGraficoSetores = () => {
    const gastosPorSetor = {};

    abastecimentos.forEach(abs => {
        if (abs.status === 'REPROVADO') return;
        
        // Acha o USUÁRIO que fez o abastecimento
        const usuario = usuarios.find(u => u.id === abs.id_usuario);
        
        let nomeSetor = 'Sem Setor';
        
        // O endpoint /usuarios/ já retorna o nome do setor agora!
        if (usuario && usuario.setor) {
            nomeSetor = usuario.setor;
        }

        if (!gastosPorSetor[nomeSetor]) gastosPorSetor[nomeSetor] = 0;
        gastosPorSetor[nomeSetor] += abs.valor_total;
    });

    return Object.keys(gastosPorSetor).map(key => ({ name: key, value: gastosPorSetor[key] }));
  };

  const dadosDiarios = processarGraficoDiario();
  const dadosSetor = processarGraficoSetores();
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

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
            <h3 style={{marginBottom:'20px'}}>Gasto Semanal (R$)</h3>
            <div style={{ height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dadosDiarios}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="dia" />
                        <YAxis />
                        <Tooltip formatter={(value) => `R$ ${value.toFixed(2)}`} />
                        <Bar dataKey="valor" fill="#0056b3" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>

        <div className="card">
            <h3 style={{marginBottom:'20px'}}>Gasto por Setor</h3>
            <div style={{ height: '300px' }}>
                {dadosSetor.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie data={dadosSetor} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                {dadosSetor.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value) => `R$ ${value.toFixed(2)}`} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                ) : (
                    <div style={{height:'100%', display:'flex', alignItems:'center', justifyContent:'center', color:'#999'}}>
                        Sem dados ainda.
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
}