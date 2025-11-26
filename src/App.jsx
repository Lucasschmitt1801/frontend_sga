import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  // Estados da aplicação
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [token, setToken] = useState(localStorage.getItem('sga_token') || '')
  const [abastecimentos, setAbastecimentos] = useState([])
  const [filtroStatus, setFiltroStatus] = useState('TODOS')
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)

  // CONFIGURAÇÃO DA URL DA API
  const API_URL = import.meta.env.VITE_API_URL || 'https://sga-api-ovqp.onrender.com';

  // --- LÓGICA DE DADOS (KPIs) ---

  const totalPendentes = abastecimentos.filter(a => a.status === 'PENDENTE_VALIDACAO').length
  const totalAprovados = abastecimentos.filter(a => a.status === 'APROVADO').length
  const totalReprovados = abastecimentos.filter(a => a.status === 'REPROVADO').length
  
  const totalGasto = abastecimentos
    .filter(a => a.status !== 'REPROVADO')
    .reduce((acc, curr) => acc + curr.valor_total, 0)

  const dadosFiltrados = abastecimentos.filter(item => {
    if (filtroStatus === 'TODOS') return true;
    return item.status === filtroStatus;
  })

  // --- FUNÇÕES DE AÇÃO ---

  const fazerLogin = async (e) => {
    e.preventDefault()
    setErro('')
    setLoading(true)
    
    const formData = new URLSearchParams()
    formData.append('username', email) 
    formData.append('password', senha)

    try {
      const res = await axios.post(`${API_URL}/auth/login`, formData)
      const t = res.data.access_token
      setToken(t)
      localStorage.setItem('sga_token', t)
    } catch (error) {
      setErro("Login falhou! Verifique o email e a palavra-passe.")
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setToken('')
    localStorage.removeItem('sga_token')
    setAbastecimentos([])
  }

  const carregarDados = () => {
    if (!token) return;
    axios.get(`${API_URL}/abastecimentos/`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setAbastecimentos(res.data))
    .catch(err => {
      if(err.response?.status === 401) logout();
    })
  }

  const aprovar = async (id) => {
    if (!confirm("Confirma a aprovação?")) return;
    try {
      await axios.patch(`${API_URL}/abastecimentos/${id}/revisar`, 
        { status: "APROVADO" }, { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Abastecimento Aprovado! ✅");
      carregarDados(); 
    } catch (error) { alert("Erro ao processar."); }
  }

  const reprovar = async (id) => {
    const motivo = prompt("Motivo da reprovação:");
    if (!motivo) return; 
    try {
      await axios.patch(`${API_URL}/abastecimentos/${id}/revisar`, 
        { status: "REPROVADO", justificativa: motivo }, { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Abastecimento Reprovado! ❌");
      carregarDados(); 
    } catch (error) { alert("Erro ao processar."); }
  }

  useEffect(() => {
    if (token) carregarDados();
  }, [token])

  if (!token) {
    return (
      <div className="login-wrapper">
        <div className="login-card">
          <h2 style={{textAlign:'center', color: '#0056b3'}}>⛽ Auditoria SGA</h2>
          <p style={{textAlign:'center', color:'#666', marginBottom:'30px'}}>Acesso Administrativo</p>
          <form onSubmit={fazerLogin}>
            <input className="login-input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" type="email" required />
            <input className="login-input" value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="Palavra-passe" type="password" required />
            {erro && <div style={{color:'red', textAlign:'center', marginBottom:'15px', fontSize:'14px'}}>{erro}</div>}
            <button type="submit" className="btn-login" disabled={loading}>{loading ? 'A Entrar...' : 'ENTRAR'}</button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="app-container">
      <header className="header">
        <h1>⛽ SGA Dashboard</h1>
        <div style={{display:'flex', alignItems:'center', gap:'15px'}}>
          <span style={{fontSize:'14px', color:'#666'}}>Admin Logado</span>
          <button onClick={logout} className="btn btn-logout">Sair</button>
        </div>
      </header>

      <div className="kpi-grid">
        <div className="kpi-card" style={{borderBottomColor: '#ffc107'}}><h3>Pendentes</h3><p style={{color: '#856404'}}>{totalPendentes}</p></div>
        <div className="kpi-card" style={{borderBottomColor: '#28a745'}}><h3>Aprovados</h3><p style={{color: '#155724'}}>{totalAprovados}</p></div>
        <div className="kpi-card" style={{borderBottomColor: '#dc3545'}}><h3>Reprovados</h3><p style={{color: '#721c24'}}>{totalReprovados}</p></div>
        <div className="kpi-card" style={{borderBottomColor: '#0056b3'}}><h3>Total Gasto</h3><p style={{color: '#0056b3'}}>R$ {totalGasto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p></div>
      </div>

      <div className="table-container">
        <div className="toolbar">
          <h2 style={{margin:0, fontSize:'18px'}}>Últimos Abastecimentos</h2>
          <select className="filter-select" value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value)}>
            <option value="TODOS">Todos os Status</option>
            <option value="PENDENTE_VALIDACAO">Pendentes</option>
            <option value="APROVADO">Aprovados</option>
            <option value="REPROVADO">Reprovados</option>
          </select>
        </div>

        {dadosFiltrados.length === 0 ? (
          <p style={{textAlign:'center', padding:'20px', color:'#999'}}>Nenhum registo encontrado.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Veículo</th>
                <th>Valor</th>
                <th>KM Atual</th> {/* NOVA COLUNA */}
                <th>Posto</th>
                <th>Localização</th>
                <th>Status</th>
                <th style={{textAlign:'center'}}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {dadosFiltrados.map((item) => (
                <tr key={item.id}>
                  <td>#{item.id}</td>
                  <td>Carro {item.id_veiculo}</td>
                  <td style={{fontWeight:'bold'}}>R$ {item.valor_total}</td>
                  
                  {/* COLUNA KM */}
                  <td>{item.quilometragem ? `${item.quilometragem} km` : '-'}</td>

                  <td>{item.nome_posto}</td>
                  
                  <td>
                    {item.gps_lat && item.gps_long ? (
                      <a href={`https://www.google.com/maps/search/?api=1&query=${item.gps_lat},${item.gps_long}`} target="_blank" rel="noopener noreferrer" style={{color: '#0056b3', textDecoration: 'none', fontSize: '13px', display:'flex', alignItems:'center', gap:'5px'}}>📍 Ver Mapa</a>
                    ) : <span style={{color:'#ccc', fontSize:'12px'}}>Sem GPS</span>}
                  </td>

                  <td>
                    <span className={`badge badge-${item.status === 'PENDENTE_VALIDACAO' ? 'pendente' : item.status.toLowerCase()}`}>
                      {item.status === 'PENDENTE_VALIDACAO' ? 'PENDENTE' : item.status}
                    </span>
                    {item.justificativa_revisao && (
                      <div style={{fontSize:'10px', color: item.justificativa_revisao.includes('OK') ? 'green' : '#dc3545', marginTop:'5px', fontWeight:'bold'}}>
                        {item.justificativa_revisao}
                      </div>
                    )}
                  </td>
                  <td style={{textAlign:'center'}}>
                    <div style={{display:'flex', flexDirection:'column', gap:'5px', alignItems:'center'}}>
                      <div style={{marginBottom:'5px'}}>
                        {item.fotos.length === 0 ? <span style={{fontSize:'11px', color:'#ccc'}}>S/ Fotos</span> : 
                          item.fotos.map(f => (
                            <a key={f.id} href={`${API_URL}/fotos/${f.url_arquivo}`} target="_blank" className="btn-photo" title={f.tipo}>📷 {f.tipo.split('_')[0]}</a>
                          ))
                        }
                      </div>
                      {item.status === 'PENDENTE_VALIDACAO' && (
                        <div>
                          <button onClick={() => aprovar(item.id)} className="btn btn-approve">✓</button>
                          <button onClick={() => reprovar(item.id)} className="btn btn-reject">✕</button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default App