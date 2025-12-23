### 2. README - Frontend (Web & Mobile PWA)
Este arquivo destaca a capacidade **PWA (Progressive Web App)** para atender ao seu requisito de funcionamento offline e adaptação para tablets/celulares.

```markdown
# SGA - Frontend (Web & Mobile)

Interface do usuário para o **Sistema de Gestão de Abastecimento**. Desenvolvido como uma **Progressive Web App (PWA)**, o sistema é totalmente responsivo (mobile-first) e possui capacidades de funcionamento offline para garantir o registro de abastecimentos mesmo em áreas sem cobertura de internet.

## 📱 Funcionalidades Principais

* **Dashboard Administrativo:** Visualização de gastos e alertas de fraude.
* **Modo Offline:** Sincronização automática de dados quando a conexão é restabelecida.
* **Responsividade:** Layout adaptável para Desktops, Tablets e Smartphones.
* **Captura de Notas:** Integração com câmera do dispositivo para envio de comprovantes.

## 🚀 Tecnologias Utilizadas

* **React:** Biblioteca principal de UI.
* **TypeScript:** Para tipagem estática e segurança do código.
* **Vite:** Build tool e servidor de desenvolvimento.
* **TanStack Query (React Query):** Gerenciamento de estado assíncrono e cache (essencial para o modo offline).
* **TailwindCSS:** Estilização utilitária e responsiva.
* **Axios:** Cliente HTTP.

## ⚙️ Pré-requisitos

* [Node.js](https://nodejs.org/) (Versão 16 ou superior).
* [NPM](https://www.npmjs.com/) ou Yarn.

## 🔧 Instalação

1. **Clone o repositório:**
   ```bash
   git clone [https://github.com/seu-usuario/sga-frontend.git](https://github.com/seu-usuario/sga-frontend.git)
   cd sga-frontend
