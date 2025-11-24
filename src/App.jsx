import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [token, setToken] = useState('')
  const [abastecimentos, setAbastecimentos] = useState([])
  const [erro, setErro] = useState('')

  // --- CONFIGURAÇÃO DA API (CORRIGIDA) ---
  // Sem a barra no final e sem "http://" duplicado
  const API_URL = 'https://sga-api-ovqp.onrender.com';

  const fazerLogin = async (e) => {
    e.preventDefault()
    setErro('')
    const formData = new URLSearchParams()
    formData.append('username', email) 
    formData.append('password', senha)

    try {
      // Uso correto da variável API_URL
      const res = await axios.post(`${API_URL}/auth/login`, formData)
      setToken(res.data.access_token)
    } catch (error) {
      setErro("Login falhou! Verifique email/senha.")
    }
  }

  const carregarDados = () => {
    axios.get(`${API_URL}/abastecimentos/`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setAbastecimentos(res.data))
  }

  const aprovar = async (id) => {
    if (!confirm("Confirma a aprovação deste abastecimento?")) return;
    try {
      await axios.patch(`${API_URL}/abastecimentos/${id}/revisar`, 
        { status: "APROVADO" }, { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Abastecimento Aprovado! ✅");
      carregarDados(); 
    } catch (error) { alert("Erro ao aprovar."); }
  }

  const reprovar = async (id) => {
    const motivo = prompt("Qual o motivo da reprovação?");
    if (!motivo) return; 
    try {
      await axios.patch(`${API_URL}/abastecimentos/${id}/revisar`, 
        { status: "REPROVADO", justificativa: motivo }, { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Abastecimento Reprovado! ❌");
      carregarDados();
    } catch (error) { alert("Erro ao reprovar."); }
  }

  useEffect(() => {
    if (token) carregarDados();
  }, [token])

  if (token) {
    return (
      <div style={{ padding: '20px' }}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
           <h1>⛽ Auditoria SGA</h1>
           <button onClick={() => setToken('')} style={{background:'#555'}}>Sair</button>
        </div>

        {abastecimentos.length === 0 ? (
          <p>Carregando dados ou nenhum registro encontrado...</p>
        ) : (
          <table border="1" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
            <thead>
              <tr style={{ background: '#333', color: 'white' }}>
                <th style={{padding: '10px'}}>ID</th>
                <th>Veículo</th>
                <th>Valor</th>
                <th>Posto</th>
                <th>Status</th>
                <th>Provas & Ação</th>
              </tr>
            </thead>
            <tbody>
              {abastecimentos.map((item) => (
                <tr key={item.id} style={{ textAlign: 'center', background: item.status === 'REPROVADO' ? '#3d0000' : '#1a1a1a' }}>
                  <td style={{padding: '10px'}}>{item.id}</td>
                  <td>Carro {item.id_veiculo}</td>
                  <td style={{ color: '#4caf50', fontWeight: 'bold' }}>R$ {item.valor_total}</td>
                  <td>{item.nome_posto}</td>
                  <td>
                    <span style={{ 
                      background: item.status === 'PENDENTE_VALIDACAO' ? 'orange' : (item.status === 'APROVADO' ? 'green' : 'red'),
                      color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight:'bold'
                    }}>
                      {item.status}
                    </span>
                    {item.justificativa_revisao && <div style={{fontSize:'10px', color:'red'}}><br/>Obs: {item.justificativa_revisao}</div>}
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems:'center', gap: '8px', padding:'5px' }}>
                      {/* FOTOS */}
                      <div style={{ display: 'flex', gap: '5px' }}>
                        {item.fotos.length === 0 ? <span style={{color: 'gray', fontSize: '11px'}}>Sem fotos</span> : item.fotos.map(foto => (
                          // CORREÇÃO DO LINK DA FOTO TAMBÉM
                          <a key={foto.id} href={`${API_URL}/fotos/${foto.url_arquivo}`} target="_blank"
                            style={{ textDecoration: 'none', background: '#646cff', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '11px' }}>
                            📷 {foto.tipo}
                          </a>
                        ))}
                      </div>
                      {/* BOTÕES (SÓ SE PENDENTE) */}
                      {item.status === 'PENDENTE_VALIDACAO' && (
                        <div style={{ display: 'flex', gap: '5px' }}>
                          <button onClick={() => aprovar(item.id)} style={{ background: 'green', border: 'none', fontSize:'12px' }}>✓ Aprovar</button>
                          <button onClick={() => reprovar(item.id)} style={{ background: 'red', border: 'none', fontSize:'12px' }}>X Reprovar</button>
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
    )
  }

  return (
    <div className="card">
      <h1>🔐 SGA Admin</h1>
      <form onSubmit={fazerLogin} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@sga.com" style={{ padding: '10px' }}/>
        <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="Senha" style={{ padding: '10px' }}/>
        {erro && <p style={{color: 'red'}}>{erro}</p>}
        <button type="submit">ENTRAR</button>
      </form>
    </div>
  )
}

export default App