# 🚀 ScriptPilot

ScriptPilot é uma plataforma self-hosted para **agendamento, execução e monitoramento de scripts** em múltiplos dispositivos da sua rede local. Com uma interface leve construída em Next.js, você pode criar tarefas programadas, executar scripts sob demanda (em Bash, Python, Node.js, etc.) e visualizar o status detalhado de cada agente conectado — tudo isso sem necessidade de login, sem dependência de serviços externos e com total controle local.

---

## 🧩 Principais Recursos

- ✅ Agendamento de tarefas com suporte a cron
- 📜 Execução de scripts Bash, Python, Node.js e mais
- 🔄 Comunicação entre interface e agentes via HTTP
- 🖥️ Visualização de status, informações do sistema e logs dos agentes
- 💻 Interface local, leve e responsiva (Next.js + TailwindCSS)
- 🔐 Zero login, zero dependência externa – 100% local

---

## 🧱 Arquitetura

```
┌────────────────────────────┐
│ Interface Web (Next.js)│
│ - Criação e controle de │
│ tarefas agendadas │
│ - Conexão com agentes │
└────────────┬───────────────┘
|
| HTTP (REST)
v
┌────────────────────┐
│ Agente ScriptPilot │ ← Rodando em cada dispositivo
│ - Executa scripts │
│ - Reporta status │
│ - Expõe endpoints │
└────────────────────┘
```

---

## 📦 Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/seuusuario/scriptpilot.git
cd scriptpilot
```
2. Instale as dependências do painel
```bash
cd interface
npm install
```
3. Rode a interface
```bash
npm run dev
```
4. Configure os agentes remotos

Cada agente pode ser um pequeno servidor (em Python, Node, etc.) rodando na máquina-alvo. Exemplo de estrutura será incluído em /agents/.
📂 Estrutura esperada

scriptpilot/
├── interface/       # Interface web (Next.js)
├── agents/          # Exemplos de agentes remotos
├── scripts/         # Scripts disponíveis para agendamento
├── logs/            # Logs das execuções
└── README.md

📃 Licença

Distribuído sob a licença MIT. Consulte LICENSE para mais informações.
✨ Contribuindo

Pull requests são bem-vindos. Para grandes mudanças, por favor abra uma issue primeiro para discutir o que você gostaria de alterar.
