import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { DollarSign, Droplet, AlertTriangle } from 'lucide-react';

const dadosGrafico = [
  { dia: 'Seg', valor: 1200 },
  { dia: 'Ter', valor: 900 },
  { dia: 'Qua', valor: 1500 },
  { dia: 'Qui', valor: 1100 },
  { dia: 'Sex', valor: 2000 },
  { dia: 'Sáb', valor: 500 },
  { dia: 'Dom', valor: 0 },
];

const topUsuarios = [
  { nome: 'Pedro Almeida', total: 'R$ 4.500', litros: 850 },
  { nome: 'João Silva', total: 'R$ 3.200', litros: 600 },
  { nome: 'Maria Souza', total: 'R$ 2.100', litros: 400 },
];

export default function Dashboard() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Visão Geral</h2>

      {/* CARDS DE KPI */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Gasto Total (Mês)</p>
            <p className="text-2xl font-bold text-gray-800">R$ 12.450,00</p>
          </div>
          <div className="p-3 bg-green-100 rounded-full text-green-600"><DollarSign /></div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Litros Consumidos</p>
            <p className="text-2xl font-bold text-gray-800">2.340 L</p>
          </div>
          <div className="p-3 bg-blue-100 rounded-full text-blue-600"><Droplet /></div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-yellow-500 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Alertas de Fraude</p>
            <p className="text-2xl font-bold text-gray-800">3 Pendentes</p>
          </div>
          <div className="p-3 bg-yellow-100 rounded-full text-yellow-600"><AlertTriangle /></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* GRÁFICO DE GASTOS */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="font-bold text-gray-700 mb-4">Gasto por Dia (Última Semana)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dadosGrafico}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="dia" />
                <YAxis />
                <Tooltip cursor={{fill: '#f0f0f0'}} />
                <Bar dataKey="valor" fill="#0056b3" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* TOP USUÁRIOS */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="font-bold text-gray-700 mb-4">Top 3 Motoristas (Gasto)</h3>
          <div className="space-y-4">
            {topUsuarios.map((user, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-200 text-blue-700 flex items-center justify-between font-bold text-sm pl-2.5 pt-0.5">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{user.nome}</p>
                    <p className="text-xs text-gray-500">{user.litros} Litros</p>
                  </div>
                </div>
                <p className="font-bold text-gray-700">{user.total}</p>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 text-blue-600 text-sm font-semibold hover:underline">Ver Ranking Completo</button>
        </div>

      </div>
    </div>
  );
}