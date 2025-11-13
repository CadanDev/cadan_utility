<?php
/**
 * Classe para carregar variáveis de ambiente do arquivo .env
 */
class EnvLoader {
    
    /**
     * Carrega as variáveis do arquivo .env
     */
    public static function load($path = null) {
        if ($path === null) {
            $path = __DIR__ . '/../.env';
        }
        
        if (!file_exists($path)) {
            throw new Exception("Arquivo .env não encontrado em: " . $path);
        }
        
        $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        
        foreach ($lines as $line) {
            // Ignorar comentários
            if (strpos(trim($line), '#') === 0) {
                continue;
            }
            
            // Separar chave=valor
            if (strpos($line, '=') !== false) {
                list($key, $value) = explode('=', $line, 2);
                $key = trim($key);
                $value = trim($value);
                
                // Remover aspas se existirem
                if (preg_match('/^"(.*)"$/', $value, $matches)) {
                    $value = $matches[1];
                } elseif (preg_match("/^'(.*)'$/", $value, $matches)) {
                    $value = $matches[1];
                }
                
                // Definir variável de ambiente
                if (!array_key_exists($key, $_ENV)) {
                    $_ENV[$key] = $value;
                }
                
                // Também definir como variável superglobal
                if (!array_key_exists($key, $_SERVER)) {
                    $_SERVER[$key] = $value;
                }
            }
        }
    }
    
    /**
     * Obter valor de uma variável de ambiente
     */
    public static function get($key, $defaultValue = null) {
        return $_ENV[$key] ?? $_SERVER[$key] ?? $defaultValue;
    }
    
    /**
     * Verificar se uma variável existe
     */
    public static function has($key) {
        return isset($_ENV[$key]) || isset($_SERVER[$key]);
    }
    
    /**
     * Obter valor como boolean
     */
    public static function getBool($key, $defaultValue = false) {
        $value = self::get($key, $defaultValue);
        
        if (is_bool($value)) {
            return $value;
        }
        
        return in_array(strtolower($value), ['true', '1', 'yes', 'on']);
    }
    
    /**
     * Obter valor como inteiro
     */
    public static function getInt($key, $defaultValue = 0) {
        return (int) self::get($key, $defaultValue);
    }
}
?>