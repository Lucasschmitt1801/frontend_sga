import React, { useState } from 'react';
import { UserPlus, RefreshCw, CheckCircle } from 'lucide-react';
import axios from 'axios';

export default function Usuarios() {
  const [nome, setNome] = useState('');
  const [empresa, setEmpresa] = useState('Carburgo');
  const [perfil, setPerfil] = useState('EXECUTOR');
  
  // Dados Gerados
  const [emailGerado, setEmailGerado] = useState('');
  const [senhaGerada, setSenhaGerada] = useState('');

  // Função Mágica: Gera credenciais
  const gerarCredenciais = () => {
    if (!nome) return alert("Digite o nome do colaborador primeiro.");

    // Lógica: nome.sobrenome@empresa.com.br
    const nomes = nome.toLowerCase().trim().split(' ');
    const primeiroNome = nomes[0];
    const ultimoNome = nomes.length > 1 ? nomes[nomes.length - 1] : '';
    
    const emailFinal = `${primeiroNome}.${ultimoNome}@${empresa.toLowerCase()}.com.br`.replace('..', '.');
    const senhaFinal = `${primeiroNome.charAt(0).toUpperCase() + primeiroNome.slice(1)}@2025`; // Ex: Pedro@2025

    setEmailGerado(emailFinal);
    setSenhaGerada(senhaFinal);
  };

  const salvarUsuario = async () => {
    try {
        // Exemplo de chamada API
        /* await axios.post('URL_API/usuarios', { 
            nome, email: emailGerado, senha: senhaGerada, perfil 
        }); */
        alert(`Usuário ${nome} criado com sucesso!`);
    } catch (error) {
        alert("Erro ao criar usuário.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Gestão de Usuários</h2>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-blue-600 p-4">
          <h3 className="text-white font-semibold flex items-center gap-2">
            <UserPlus size={20}/> Novo Colaborador
          </h3>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* LADO ESQUERDO: DADOS PESSOAIS */}
          <div className="space-y-4">
            <h4 className="text-sm uppercase tracking-wide text-gray-500 font-bold mb-2">Dados Pessoais</h4>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Nome Completo</label>
              <input 
                type="text" 
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
                placeholder="Ex: Pedro Almeida"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Empresa / Filial</label>
              <input 
                type="text" 
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md" 
                value={empresa}
                onChange={(e) => setEmpresa(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Nível de Acesso</label>
              <select 
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-white"
                value={perfil}
                onChange={(e) => setPerfil(e.target.value)}
              >
                <option value="EXECUTOR">Colaborador (App Mobile)</option>
                <option value="ADMIN">Administrador (Painel Web)</option>
              </select>
            </div>

            <button 
                onClick={gerarCredenciais}
                className="mt-4 w-full flex items-center justify-center gap-2 bg-gray-800 text-white py-2 rounded hover:bg-gray-700 transition"
            >
                <RefreshCw size={16} /> Gerar Login Automático
            </button>
          </div>

          {/* LADO DIREITO: CREDENCIAIS GERADAS */}
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 flex flex-col justify-center">
            <h4 className="text-sm uppercase tracking-wide text-gray-500 font-bold mb-4 text-center">Credenciais de Acesso</h4>
            
            {emailGerado ? (
                <div className="space-y-4">
                    <div>
                        <span className="text-xs text-gray-500">Login (Email)</span>
                        <div className="font-mono text-lg font-bold text-blue-700 break-all">{emailGerado}</div>
                    </div>
                    <div>
                        <span className="text-xs text-gray-500">Senha Inicial</span>
                        <div className="font-mono text-lg font-bold text-green-600">{senhaGerada}</div>
                    </div>
                    <div className="bg-yellow-50 border border-yellow-200 p-2 text-xs text-yellow-800 rounded mt-2">
                        ⚠️ Informe esta senha ao colaborador. Ele poderá alterá-la depois.
                    </div>
                </div>
            ) : (
                <div className="text-center text-gray-400 py-10">
                    Preencha os dados ao lado e clique em "Gerar" para criar o login.
                </div>
            )}
          </div>

        </div>

        {/* RODAPÉ DO CARD */}
        <div className="p-4 bg-gray-50 border-t flex justify-end">
            <button 
                onClick={salvarUsuario}
                disabled={!emailGerado}
                className={`flex items-center gap-2 px-6 py-2 rounded-md text-white font-bold shadow-md transition ${
                    emailGerado ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-300 cursor-not-allowed'
                }`}
            >
                <CheckCircle size={20} /> Criar Usuário
            </button>
        </div>
      </div>
    </div>
  );
}