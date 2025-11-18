# 📋 Sistema de Lembretes

Sistema completo de organização pessoal com lembretes de remédios, timer de descanso para os olhos, calendário de eventos, notas e controle de abastecimento de veículos.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![PHP](https://img.shields.io/badge/PHP-7.4+-purple)
![License](https://img.shields.io/badge/license-MIT-green)

## 🎯 Funcionalidades

### 🏠 Dashboard
- Visão geral de todas as funcionalidades
- Acesso rápido aos módulos principais
- Interface responsiva e intuitiva

### 👁️ Descanso de Olhos
- Timer baseado na regra 20-20-20 (a cada 20 minutos, olhe para algo a 20 pés de distância por 20 segundos)
- Notificações visuais e sonoras
- Histórico de sessões
- Pausa e retomada do timer

### 💊 Lembretes de Remédios
- Cadastro de medicamentos com nome, dosagem e horários
- Sistema de notificações para não esquecer remédios
- Histórico de medicamentos tomados
- Gerenciamento completo (criar, editar, excluir)

### 📅 Calendário
- Visualização mensal de eventos
- Criação e edição de eventos
- Diferentes categorias com cores
- Sincronização com backend

### 📝 Notas
- Sistema de notas rápidas
- Editor simples e prático
- Armazenamento local e em nuvem
- Busca e organização

### ⛽ Controle de Abastecimento
- Registro de abastecimentos de veículos
- Cálculo automático de consumo médio
- Histórico detalhado por veículo
- Estatísticas de gastos

### 🔐 Sistema de Autenticação
- Cadastro e login de usuários
- Sessões seguras com PHP
- Área de perfil com foto
- Modo visitante para demonstração

## 🛠️ Tecnologias

### Frontend
- **HTML5** - Estrutura semântica
- **SCSS/CSS3** - Estilização modular e responsiva
- **JavaScript (Vanilla)** - Lógica do cliente
- **Bootstrap Icons** - Ícones

### Backend
- **PHP 7.4+** - Linguagem server-side
- **MySQL** - Banco de dados relacional
- **PDO** - Camada de abstração de dados

### Ferramentas
- **SASS** - Pré-processador CSS
- **VS Code Tasks** - Automação de tarefas
- **Git** - Controle de versão

## 📁 Estrutura do Projeto

```
Lembretes/
├── index.html              # Dashboard principal
├── login.html              # Página de login
├── register.html           # Página de cadastro
├── eye-rest.html          # Timer de descanso
├── medicines.html         # Gerenciamento de remédios
├── calendar.html          # Calendário de eventos
├── notes.html             # Sistema de notas
├── fuel-tracker.html      # Controle de abastecimento
├── package.json           # Dependências Node.js
│
├── backend/
│   ├── api/               # Endpoints da API
│   │   ├── auth-status.php
│   │   ├── login.php
│   │   ├── register.php
│   │   ├── logout.php
│   │   ├── medicines.php
│   │   ├── events.php
│   │   ├── cars.php
│   │   └── fuel-logs.php
│   ├── classes/           # Classes PHP
│   │   ├── User.php
│   │   ├── MedicineReminder.php
│   │   ├── CalendarEvent.php
│   │   ├── Car.php
│   │   └── FuelLog.php
│   ├── config/            # Configurações
│   │   ├── config.php
│   │   ├── database.php
│   │   ├── env.php
│   │   └── auth.php
│   ├── logs/              # Logs do sistema
│   └── database.sql       # Schema do banco
│
├── components/
│   └── navbar.html        # Navbar reutilizável
│
├── js/
│   ├── app.js            # Inicialização geral
│   ├── auth.js           # Autenticação
│   ├── navbar.js         # Navbar dinâmica
│   ├── calendar.js       # Funcionalidades do calendário
│   ├── eyeRestTimer.js   # Timer de descanso
│   ├── medicineReminders.js
│   ├── fuelTracker.js
│   ├── notes.js
│   ├── offlineStorage.js
│   └── utils.js          # Funções utilitárias
│
└── css/
    ├── styles.scss       # SCSS modular
    └── styles.css        # CSS compilado
```

## 🚀 Como Usar Localmente

### Pré-requisitos

- PHP 7.4 ou superior
- MySQL/MariaDB
- Node.js (para compilar SASS)
- Servidor web (Apache/Nginx) ou Python para desenvolvimento

### 1. Clone o Repositório

```bash
git clone https://github.com/CadanDev/cadan_utility.git
cd cadan_utility
```

### 2. Configure o Banco de Dados

```bash
# Importe o schema
mysql -u root -p < backend/database.sql
```

Crie o arquivo `backend/config/env.php`:

```php
<?php
// Configurações do Banco de Dados
define('DB_HOST', 'localhost');
define('DB_NAME', 'lembretes_db');
define('DB_USER', 'root');
define('DB_PASS', 'sua_senha');

// Configurações da Aplicação
define('APP_ENV', 'development');
define('APP_DEBUG', true);
```

### 3. Instale Dependências

```bash
npm install
```

### 4. Inicie os Servidores

#### Usando VS Code Tasks (Recomendado)

O projeto já vem com tasks configuradas no VS Code:

- **Start Python Server**: Inicia servidor HTTP na porta 5200
- **Watch SASS**: Compila SCSS automaticamente

Execute via `Terminal > Run Task...` ou `Ctrl+Shift+P` → "Tasks: Run Task"

#### Manualmente

```bash
# Terminal 1: Servidor Python
python -m http.server 5200

# Terminal 2: Watch SASS
sass --watch css/styles.scss:css/styles.css
```

### 5. Acesse a Aplicação

Abra o navegador em: `http://localhost:5200`

## 🌐 Deploy na Hostinger

### 1. Configurar Banco de Dados

1. Acesse o painel da Hostinger
2. Crie um banco MySQL
3. Anote as credenciais fornecidas
4. Importe o arquivo `backend/database.sql` via phpMyAdmin

### 2. Upload dos Arquivos

Via FTP/SFTP ou File Manager, envie todos os arquivos para `public_html/`:

```
public_html/
├── index.html
├── login.html
├── backend/
├── js/
├── css/
└── components/
```

### 3. Configurar Variáveis de Ambiente

Edite `backend/config/env.php` com as credenciais da Hostinger:

```php
<?php
define('DB_HOST', 'localhost');
define('DB_NAME', 'u829917439_lembretes');
define('DB_USER', 'u829917439_user');
define('DB_PASS', 'senha_hostinger');

define('APP_ENV', 'production');
define('APP_DEBUG', false);
```

### 4. Ajustar Permissões

```bash
chmod 755 backend/logs/
```

### 5. Testar

Acesse seu domínio: `https://seudominio.com`

## 🔧 Scripts Disponíveis

```bash
# Compilar SCSS uma vez
npm run build-css

# Watch SCSS (recompila automaticamente)
npm run watch-css

# Alias para watch
npm run dev
```

## 📊 Estrutura do Banco de Dados

### Tabelas Principais

- **users** - Usuários do sistema
- **medicine_reminders** - Lembretes de medicamentos
- **calendar_events** - Eventos do calendário
- **cars** - Veículos cadastrados
- **fuel_logs** - Registros de abastecimento
- **notes** - Notas dos usuários

Veja o schema completo em [`backend/database.sql`](backend/database.sql)

## 🎨 Personalização

### Cores e Temas

Edite as variáveis SCSS em `css/styles.scss`:

```scss
$primary-color: #007bff;
$success-color: #28a745;
$danger-color: #dc3545;
```

### Configurações do Timer

Edite em `js/eyeRestTimer.js`:

```javascript
const WORK_TIME = 20 * 60; // 20 minutos
const REST_TIME = 20; // 20 segundos
```

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/NovaFuncionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/NovaFuncionalidade`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👨‍💻 Autor

**Lucas Cadan**
- GitHub: [@CadanDev](https://github.com/CadanDev)

## 🆘 Suporte

Se encontrar problemas ou tiver sugestões:

1. Abra uma [Issue](https://github.com/CadanDev/cadan_utility/issues)
2. Entre em contato via GitHub

## 📸 Screenshots

### Dashboard
Interface principal com acesso rápido a todos os módulos.

### Timer de Descanso
Sistema de notificação para saúde dos olhos.

### Calendário
Visualização mensal com eventos coloridos por categoria.

### Controle de Abastecimento
Registro detalhado com cálculo de consumo médio.

---

⭐ Se este projeto foi útil para você, considere dar uma estrela no repositório!
