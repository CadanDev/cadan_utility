# 🎯 COMANDOS ESPECÍFICOS HOSTINGER

## 🔍 VERIFICAÇÕES NO SERVIDOR

### 1. Verificar se PHP está funcionando
Crie um arquivo `info.php` na pasta public_html:
```php
<?php
phpinfo();
?>
```
Acesse: `https://seudominio.com/info.php`

### 2. Verificar conexão com banco
Use este código em `test-db.php`:
```php
<?php
try {
    $pdo = new PDO(
        'mysql:host=localhost;dbname=u829917439_cadan_utility;charset=utf8mb4',
        'u829917439_cadan_utility',
        'SUA_SENHA_AQUI'
    );
    echo "✅ Conexão com banco OK!";
} catch(PDOException $e) {
    echo "❌ Erro: " . $e->getMessage();
}
?>
```

### 3. Verificar se as tabelas existem
```sql
-- Execute no phpMyAdmin
SHOW TABLES;
DESCRIBE users;
```

## 🛠️ TROUBLESHOOTING HOSTINGER

### ❌ Erro: "500 Internal Server Error"
1. Verifique o arquivo `.htaccess` (se existir)
2. Verifique permissões dos arquivos:
   - Arquivos: 644
   - Pastas: 755
3. Veja os logs em: Painel → "Error Logs"

### ❌ Erro: "Database connection failed"
1. Confirme credenciais no .env
2. Teste conexão manual com test-db.php
3. Verifique se o banco existe no painel

### ❌ CORS Error
Adicione no início dos arquivos PHP da API:
```php
header('Access-Control-Allow-Origin: https://seudominio.com');
header('Access-Control-Allow-Credentials: true');
```

### ❌ Sessões não funcionam
Verifique se existe pasta `tmp/` com permissões adequadas

## 📁 ESTRUTURA RECOMENDADA NO HOSTINGER

```
public_html/
├── 🏠 ARQUIVOS PRINCIPAIS (público)
│   ├── index.html
│   ├── login.html
│   ├── register.html
│   ├── test-api.html    # Para testes
│   ├── info.php         # Info do PHP (remover depois)
├── 📁 css/
├── 📁 js/
└── 📁 backend/          # APIs e configurações
    ├── .env             # ⚠️ CRIAR NO SERVIDOR
    └── ... (resto dos arquivos)
```

## 🔧 CONFIGURAÇÕES .htaccess (OPCIONAL)

Se precisar, crie `.htaccess` na pasta `backend/`:
```apache
# Proteger arquivo .env
<Files ".env">
    Order Allow,Deny
    Deny from all
</Files>

# Headers de segurança
Header always set X-Content-Type-Options nosniff
Header always set X-Frame-Options DENY
Header always set X-XSS-Protection "1; mode=block"

# Habilitar CORS para APIs
<IfModule mod_headers.c>
    Header set Access-Control-Allow-Origin "*"
    Header set Access-Control-Allow-Methods "GET, POST, OPTIONS"
    Header set Access-Control-Allow-Headers "Content-Type, Authorization"
</IfModule>
```

## 🚀 OTIMIZAÇÕES HOSTINGER

### 1. Cache PHP
No painel Hostinger:
- Ative "PHP OPcache"
- Configure "PHP Memory Limit" para 256MB

### 2. SSL Gratuito
- Painel → "SSL/TLS" → "Gerenciar SSL"
- Ativar SSL gratuito Let's Encrypt

### 3. Backup Automático
- Painel → "Backups"
- Configurar backup diário/semanal

## ⚡ COMANDOS ÚTEIS VIA SSH (se disponível)

```bash
# Verificar versão PHP
php -v

# Testar sintaxe PHP
php -l arquivo.php

# Ver logs de erro
tail -f error_log

# Permissões corretas
find . -type f -exec chmod 644 {} \;
find . -type d -exec chmod 755 {} \;
```

## 🎯 CHECKLIST FINAL

✅ Banco de dados criado e tabelas executadas  
✅ Arquivo .env criado no servidor com dados reais  
✅ Todos os arquivos enviados para public_html  
✅ Permissões corretas (644/755)  
✅ SSL ativado  
✅ Teste de cadastro funcionando  
✅ Teste de login funcionando  
✅ APIs respondendo corretamente  

## 🔗 URLs de Teste

Substitua `seudominio.com` pelo seu domínio real:

- 🏠 **Homepage:** https://seudominio.com/
- 🔐 **Login:** https://seudominio.com/login.html
- 📝 **Cadastro:** https://seudominio.com/register.html
- 🧪 **Teste APIs:** https://seudominio.com/test-api.html
- 📊 **Info PHP:** https://seudominio.com/info.php (remover depois)

### APIs:
- 📤 **Cadastro:** POST https://seudominio.com/backend/api/register.php
- 🔑 **Login:** POST https://seudominio.com/backend/api/login.php
- 🚪 **Logout:** POST https://seudominio.com/backend/api/logout.php