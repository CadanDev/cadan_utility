<?php
/**
 * Classe de Configuração da Aplicação
 * Centraliza todas as configurações usando variáveis de ambiente
 */

require_once __DIR__ . '/env.php';

class Config {
    
    /**
     * Inicializar configurações
     */
    public static function init() {
        // Carregar variáveis do .env
        EnvLoader::load();
        
        // Configurar timezone
        date_default_timezone_set('America/Sao_Paulo');
        
        // Configurar exibição de erros baseado no ambiente
        if (self::isDebug()) {
            error_reporting(E_ALL);
            ini_set('display_errors', 1);
        } else {
            error_reporting(0);
            ini_set('display_errors', 0);
        }
        
        // Configurar sessão
        if (session_status() === PHP_SESSION_NONE) {
            ini_set('session.gc_maxlifetime', self::getSessionLifetime());
            session_start();
        }
    }
    
    // Configurações do Banco de Dados
    public static function getDbHost() {
        return EnvLoader::get('DB_HOST', 'localhost');
    }
    
    public static function getDbName() {
        return EnvLoader::get('DB_NAME');
    }
    
    public static function getDbUser() {
        return EnvLoader::get('DB_USER');
    }
    
    public static function getDbPass() {
        return EnvLoader::get('DB_PASS');
    }
    
    // Configurações da Aplicação
    public static function getAppName() {
        return EnvLoader::get('APP_NAME', 'Sistema de Lembretes');
    }
    
    public static function getAppEnv() {
        return EnvLoader::get('APP_ENV', 'production');
    }
    
    public static function isDebug() {
        return EnvLoader::getBool('APP_DEBUG', false);
    }
    
    public static function isDevelopment() {
        return self::getAppEnv() === 'development';
    }
    
    public static function isProduction() {
        return self::getAppEnv() === 'production';
    }
    
    // Configurações de Segurança
    public static function getSessionLifetime() {
        return EnvLoader::getInt('SESSION_LIFETIME', 3600);
    }
    
    public static function getPasswordMinLength() {
        return EnvLoader::getInt('PASSWORD_MIN_LENGTH', 6);
    }
    
    public static function getUsernameMinLength() {
        return EnvLoader::getInt('USERNAME_MIN_LENGTH', 3);
    }
    
    // Configurações de CORS
    public static function getCorsOrigin() {
        return EnvLoader::get('CORS_ORIGIN', '*');
    }
    
    public static function getCorsMethods() {
        return EnvLoader::get('CORS_METHODS', 'GET,POST,PUT,DELETE,OPTIONS');
    }
    
    public static function getCorsHeaders() {
        return EnvLoader::get('CORS_HEADERS', 'Content-Type,Authorization');
    }
    
    // Configurações de Email (para futuras funcionalidades)
    public static function getSmtpHost() {
        return EnvLoader::get('SMTP_HOST');
    }
    
    public static function getSmtpPort() {
        return EnvLoader::getInt('SMTP_PORT', 587);
    }
    
    public static function getSmtpUser() {
        return EnvLoader::get('SMTP_USER');
    }
    
    public static function getSmtpPass() {
        return EnvLoader::get('SMTP_PASS');
    }
    
    public static function getSmtpFrom() {
        return EnvLoader::get('SMTP_FROM', 'noreply@localhost');
    }
    
    /**
     * Validar se todas as configurações obrigatórias estão definidas
     */
    public static function validate() {
        $required = ['DB_NAME', 'DB_USER', 'DB_PASS'];
        $missing = [];
        
        foreach ($required as $key) {
            if (!EnvLoader::has($key)) {
                $missing[] = $key;
            }
        }
        
        if (!empty($missing)) {
            throw new Exception("Configurações obrigatórias não encontradas: " . implode(', ', $missing));
        }
    }
}
?>