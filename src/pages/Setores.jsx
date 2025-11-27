import React, { useState } from 'react';
import { Layers, Plus, Trash2 } from 'lucide-react';

export default function Setores() {
  const [setores, setSetores] = useState([
    { id: 1, nome: 'Logística', gasto: 'R$ 5.400' },
    { id: 2, nome: 'Comercial', gasto: 'R$ 2.100' },
    { id: 3, nome: 'Operacional', gasto: 'R$ 8.900' }
  ]);
  const [novoSetor, setNovoSetor] = useState('');

  const adicionar = () => {
    if (!novoSetor) return;
    setSetores([...setores, { id: Date.now(), nome: novoSetor, gasto: 'R$ 0,00' }]);
    setNovoSetor('');
  };

  const remover = (id) => {
    if (confirm("Remover este setor?")) {
        setSetores(setores.filter(s => s.id !== id));
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Gestão de Setores</h1>
        <p className="page-subtitle">Organize sua frota por departamentos.</p>
      </div>

      <div className="grid-dashboard">
        {/* Lista de Setores */}
        <div className="card">
            <h3 style={{marginBottom:'20px'}}>Setores Ativos</h3>
            <table style={{minWidth:'100%'}}>
                <thead><tr><th>Nome</th><th>Gasto Acumulado</th><th>Ação</th></tr></thead>
                <tbody>
                    {setores.map(s => (
                        <tr key={s.id}>
                            <td style={{fontWeight:'bold'}}>{s.nome}</td>
                            <td>{s.gasto}</td>
                            <td>
                                <button onClick={() => remover(s.id)} className="btn btn-danger" style={{padding:'5px 10px'}}>
                                    <Trash2 size={16}/>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        {/* Adicionar Novo */}
        <div className="card" style={{height: 'fit-content'}}>
            <h3>Novo Setor</h3>
            <div className="form-group">
                <label>Nome do Departamento</label>
                <input 
                    className="form-control" 
                    value={novoSetor} 
                    onChange={e => setNovoSetor(e.target.value)} 
                    placeholder="Ex: Marketing" 
                />
            </div>
            <button onClick={adicionar} className="btn btn-success" style={{width:'100%'}}>
                <Plus size={18}/> Adicionar
            </button>
        </div>
      </div>
    </div>
  );
}