# 🚀 GUIA DE DEPLOY NO HOSTINGER

## 📋 Checklist Pré-Deploy

✅ Backend PHP criado  
✅ Arquivo .env local configurado  
✅ Sistema de autenticação pronto  
✅ .gitignore protegendo dados sensíveis  

## 🎯 PASSO A PASSO - DEPLOY HOSTINGER

### 1️⃣ PREPARAR BANCO DE DADOS

1. **Acesse o painel do Hostinger:**
   - Login no seu painel Hostinger
   - Vá em "Websites" → Seu domínio

2. **Acessar MySQL:**
   - Clique em "Bancos de Dados" ou "MySQL Databases"
   - Você já tem as credenciais:
     - **Database:** u829917439_cadan_utility
     - **Username:** u829917439_cadan_utility
     - **Password:** (sua senha atual)
     - **Host:** localhost

3. **Executar SQL:**
   - Clique em "phpMyAdmin"
   - Selecione seu banco: `u829917439_cadan_utility`
   - Vá na aba "SQL"
   - Cole e execute o conteúdo do arquivo `backend/database.sql`

### 2️⃣ CONFIGURAR ARQUIVOS

1. **No seu computador:**
   - Mantenha toda estrutura como está
   - NÃO altere o .env local

2. **No servidor Hostinger:**
   - Você criará um novo .env diretamente no servidor

### 3️⃣ UPLOAD DOS ARQUIVOS

**Opção A - File Manager (Recomendado):**
1. No painel Hostinger → "File Manager"
2. Navegue até `public_html/`
3. Upload de TODOS os arquivos:
   ```
   ✅ index.html
   ✅ login.html  
   ✅ register.html
   ✅ css/ (pasta completa)
   ✅ js/ (pasta completa)
   ✅ backend/ (pasta completa, EXCETO o .env local)
   ```

**Opção B - FTP:**
- Use FileZilla ou similar
- Host: seu domínio
- Usuário/senha: dados FTP do Hostinger

### 4️⃣ CRIAR .ENV NO SERVIDOR

1. **No File Manager do Hostinger:**
   - Navegue até `public_html/backend/`
   - Clique em "New File"
   - Nome: `.env`

2. **Conteúdo do .env (SUBSTITUA COM SEUS DADOS):**
   ```env
   # Configurações do Banco de Dados - HOSTINGER
   DB_HOST=localhost
   DB_NAME=u829917439_cadan_utility  
   DB_USER=u829917439_cadan_utility
   DB_PASS=SUA_SENHA_REAL_DO_HOSTINGER_AQUI
   
   # Configurações da Aplicação
   APP_NAME=Sistema de Lembretes
   APP_ENV=production
   APP_DEBUG=false
   
   # Configurações de Segurança
   SESSION_LIFETIME=3600
   PASSWORD_MIN_LENGTH=6
   USERNAME_MIN_LENGTH=3
   
   # CORS para seu domínio
   CORS_ORIGIN=*
   CORS_METHODS=GET,POST,PUT,DELETE,OPTIONS
   CORS_HEADERS=Content-Type,Authorization
   ```

### 5️⃣ TESTAR A APLICAÇÃO

1. **Acesse seu site:**
   - `https://seudominio.com/`
   - `https://seudominio.com/login.html`
   - `https://seudominio.com/register.html`

2. **Teste as funcionalidades:**
   - Cadastro de usuário
   - Login
   - Logout

3. **APIs disponíveis:**
   - `https://seudominio.com/backend/api/register.php`
   - `https://seudominio.com/backend/api/login.php`
   - `https://seudominio.com/backend/api/logout.php`

## 🛠️ ESTRUTURA FINAL NO SERVIDOR

```
public_html/
├── index.html              # Página principal
├── login.html              # Página de login  
├── register.html           # Página de cadastro
├── css/
│   ├── styles.css
│   └── styles.scss
├── js/
│   ├── app.js
│   ├── calendar.js
│   ├── eyeRestTimer.js
│   ├── medicineReminders.js
│   └── utils.js
└── backend/
    ├── .env                # ⚠️ CRIAR NO SERVIDOR!
    ├── .env.example
    ├── .gitignore
    ├── README.md
    ├── database.sql
    ├── config/
    │   ├── auth.php
    │   ├── config.php
    │   ├── database.php
    │   ├── env.php
    │   └── utils.php
    ├── classes/
    │   └── User.php
    └── api/
        ├── login.php
        ├── logout.php
        └── register.php
```

## 🔧 POSSÍVEIS PROBLEMAS E SOLUÇÕES

### ❌ Erro "Database connection failed"
- ✅ Verifique se o .env foi criado no servidor
- ✅ Confirme as credenciais do banco
- ✅ Execute o SQL para criar as tabelas

### ❌ Erro "File not found" nas APIs
- ✅ Verifique se a pasta backend foi enviada
- ✅ Confirme as permissões de arquivo (644 para arquivos, 755 para pastas)

### ❌ CORS Error no JavaScript
- ✅ Ajuste CORS_ORIGIN no .env se necessário
- ✅ Use seu domínio específico ao invés de *

### ❌ Erro de Sessão
- ✅ Verifique se o PHP tem permissão para criar sessões
- ✅ Hostinger geralmente já configura isso automaticamente

## 📞 SUPORTE

Se tiver problemas:
1. Verifique o .env no servidor
2. Use phpMyAdmin para confirmar se as tabelas existem
3. Hostinger tem suporte 24/7 via chat
4. Logs de erro estão em: painel → "Error Logs"

## 🎉 PRÓXIMOS PASSOS

Depois que estiver funcionando:
1. Integrar autenticação no index.html
2. Salvar lembretes por usuário
3. Adicionar recuperação de senha
4. Configurar HTTPS (SSL) no Hostinger