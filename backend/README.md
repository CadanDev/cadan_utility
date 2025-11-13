# Backend PHP - Sistema de Lembretes

Este é um backend PHP simples para gerenciar usuários com sistema de login/cadastro.

## 📋 Estrutura do Projeto

```
backend/
├── config/
│   ├── config.php       # Configurações centralizadas
│   ├── database.php     # Configuração do banco de dados
│   ├── env.php          # Carregador de variáveis de ambiente
│   ├── auth.php         # Middleware de autenticação
│   └── utils.php        # Funções utilitárias
├── classes/
│   └── User.php         # Classe para gerenciar usuários
├── api/
│   ├── register.php     # API para cadastro
│   ├── login.php        # API para login
│   └── logout.php       # API para logout
├── .env.example         # Exemplo de configuração
├── .env                 # Configurações reais (não versionar!)
├── .gitignore           # Arquivos a ignorar no Git
├── database.sql         # Script SQL para criar tabelas
└── README.md            # Esta documentação
```

## 🚀 Configuração no Hostinger

### 1. Configurar Arquivo .env

1. Copie o arquivo `.env.example` para `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edite o arquivo `.env` com suas configurações do Hostinger:
   ```env
   # Configurações do Banco de Dados - HOSTINGER
   DB_HOST=localhost
   DB_NAME=u829917439_cadan_utility
   DB_USER=u829917439_cadan_utility
   DB_PASS=SUA_SENHA_REAL_AQUI
   
   # Configurações da Aplicação
   APP_ENV=production
   APP_DEBUG=false
   ```

### 2. Configurar Banco de Dados

1. Acesse o painel do Hostinger
2. Vá em "Bancos de Dados MySQL"
3. Use suas informações de banco existentes

### 3. Criar Tabelas

1. Acesse o phpMyAdmin no Hostinger
2. Selecione seu banco `u829917439_cadan_utility`
3. Execute o script SQL do arquivo `backend/database.sql`

### 4. Upload dos Arquivos

1. Faça upload de toda a pasta `backend/` para seu servidor Hostinger
2. **IMPORTANTE:** Certifique-se de que o arquivo `.env` foi criado com suas configurações reais
3. **SEGURANÇA:** Nunca commite o arquivo `.env` no Git (já está no .gitignore)

## 🔧 Como Usar

### APIs Disponíveis

#### 1. Cadastro de Usuário
- **URL:** `backend/api/register.php`
- **Método:** POST
- **Dados JSON:**
```json
{
    "name": "João Silva",
    "username": "joao123",
    "email": "joao@email.com",
    "password": "minhasenha"
}
```

#### 2. Login
- **URL:** `backend/api/login.php`
- **Método:** POST
- **Dados JSON:**
```json
{
    "username": "joao123",
    "password": "minhasenha"
}
```

#### 3. Logout
- **URL:** `backend/api/logout.php`
- **Método:** POST

### Páginas Frontend

- `login.html` - Página de login
- `register.html` - Página de cadastro

## 🔐 Recursos de Segurança

- ✅ **Configurações Seguras:** Arquivo `.env` para dados sensíveis
- ✅ **Senhas Criptografadas:** password_hash() com salt automático
- ✅ **SQL Injection:** Proteção com PDO prepared statements
- ✅ **Validação Robusta:** Validação de dados de entrada
- ✅ **Sanitização:** Limpeza de dados HTML/XSS
- ✅ **Usuários Únicos:** Verificação de duplicados
- ✅ **Sessões Seguras:** PHP sessions com timeout configurável
- ✅ **CORS Configurável:** Headers CORS personalizáveis
- ✅ **Rate Limiting:** Proteção básica contra ataques de força bruta
- ✅ **Logs de Erro:** Sistema de logging estruturado

## 📝 Validações

### Cadastro
- Nome: obrigatório
- Username: obrigatório, mínimo 3 caracteres, único
- Email: obrigatório, formato válido, único
- Senha: obrigatória, mínimo 6 caracteres

### Login
- Username ou Email: obrigatório
- Senha: obrigatória

## 🛠️ Próximos Passos

Para integrar com seu sistema de lembretes, você pode:

1. Adicionar verificação de autenticação no `index.html`
2. Criar APIs para salvar/recuperar lembretes por usuário
3. Adicionar campos específicos do seu sistema na tabela users
4. Implementar recuperação de senha

## 📞 Suporte

Se tiver algum problema:
1. **Verificar .env:** Confirme se o arquivo `.env` existe e tem as configurações corretas
2. **Banco de Dados:** Verifique se as credenciais no `.env` estão corretas
3. **Tabelas:** Certifique-se de que executou o script `database.sql`
4. **Permissões:** Verifique se o servidor tem permissão para ler o arquivo `.env`
5. **Logs:** Para debug, altere `APP_DEBUG=true` no `.env` temporariamente
6. **CORS:** Se tiver problemas de CORS, ajuste as configurações no `.env`

## ⚙️ Configurações Disponíveis (.env)

### Banco de Dados
- `DB_HOST` - Host do banco (padrão: localhost)
- `DB_NAME` - Nome do banco de dados
- `DB_USER` - Usuário do banco
- `DB_PASS` - Senha do banco

### Aplicação
- `APP_NAME` - Nome da aplicação
- `APP_ENV` - Ambiente (development/production)
- `APP_DEBUG` - Mostrar erros detalhados (true/false)

### Segurança
- `SESSION_LIFETIME` - Tempo de vida da sessão em segundos
- `PASSWORD_MIN_LENGTH` - Tamanho mínimo da senha
- `USERNAME_MIN_LENGTH` - Tamanho mínimo do username

### CORS
- `CORS_ORIGIN` - Origens permitidas (* para todas)
- `CORS_METHODS` - Métodos HTTP permitidos
- `CORS_HEADERS` - Headers permitidos