<?php

class Logger {
    private static $logDir = null;
    private static $logFile = 'system.log';
    private static $debugMode = true; // Pode ser configurado via Config
    
    private static function getLogDir() {
        if (self::$logDir === null) {
            // Determinar o caminho baseado na localização do arquivo
            $currentDir = dirname(__DIR__);
            self::$logDir = $currentDir . DIRECTORY_SEPARATOR . 'logs' . DIRECTORY_SEPARATOR;
        }
        return self::$logDir;
    }
    
    // Níveis de log
    const DEBUG = 'DEBUG';
    const INFO = 'INFO';
    const WARNING = 'WARNING';
    const ERROR = 'ERROR';
    const CRITICAL = 'CRITICAL';
    
    public static function init() {
        // Criar diretório de logs se não existir
        $logDir = self::getLogDir();
        if (!file_exists($logDir)) {
            mkdir($logDir, 0755, true);
        }
    }
    
    public static function debug($message, $context = []) {
        if (self::$debugMode) {
            self::log(self::DEBUG, $message, $context);
        }
    }
    
    public static function info($message, $context = []) {
        self::log(self::INFO, $message, $context);
    }
    
    public static function warning($message, $context = []) {
        self::log(self::WARNING, $message, $context);
    }
    
    public static function error($message, $context = []) {
        self::log(self::ERROR, $message, $context);
    }
    
    public static function critical($message, $context = []) {
        self::log(self::CRITICAL, $message, $context);
    }
    
    private static function log($level, $message, $context = []) {
        self::init();
        
        $timestamp = date('Y-m-d H:i:s');
        $requestId = self::getRequestId();
        $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? 'Unknown';
        $ip = self::getClientIP();
        $method = $_SERVER['REQUEST_METHOD'] ?? 'CLI';
        $uri = $_SERVER['REQUEST_URI'] ?? 'CLI';
        
        $logEntry = [
            'timestamp' => $timestamp,
            'request_id' => $requestId,
            'level' => $level,
            'message' => $message,
            'context' => $context,
            'ip' => $ip,
            'user_agent' => $userAgent,
            'method' => $method,
            'uri' => $uri,
            'memory_usage' => memory_get_usage(true),
            'session_id' => session_id() ?: null
        ];
        
        // Log em formato legível
        $logLine = sprintf(
            "[%s] [%s] [%s] %s %s - %s\n",
            $timestamp,
            $requestId,
            $level,
            $method,
            $uri,
            $message
        );
        
        if (!empty($context)) {
            $logLine .= "Context: " . json_encode($context, JSON_PRETTY_PRINT) . "\n";
        }
        
        $logLine .= "IP: {$ip} | User-Agent: {$userAgent} | Memory: " . self::formatBytes($logEntry['memory_usage']) . "\n";
        $logLine .= str_repeat('-', 80) . "\n";
        
        // Salvar no arquivo
        $logDir = self::getLogDir();
        file_put_contents($logDir . self::$logFile, $logLine, FILE_APPEND | LOCK_EX);
        
        // Também salvar em JSON para análise programática
        $jsonLogFile = str_replace('.log', '.json', self::$logFile);
        file_put_contents(
            $logDir . $jsonLogFile, 
            json_encode($logEntry) . "\n", 
            FILE_APPEND | LOCK_EX
        );
        
        // Log crítico também vai para error_log do PHP
        if ($level === self::CRITICAL || $level === self::ERROR) {
            error_log("[$level] $message - Context: " . json_encode($context));
        }
    }
    
    private static function getRequestId() {
        if (!isset($_SERVER['REQUEST_ID'])) {
            $_SERVER['REQUEST_ID'] = uniqid('req_', true);
        }
        return $_SERVER['REQUEST_ID'];
    }
    
    private static function getClientIP() {
        $ipKeys = ['HTTP_CF_CONNECTING_IP', 'HTTP_X_FORWARDED_FOR', 'HTTP_X_FORWARDED', 'HTTP_FORWARDED_FOR', 'HTTP_FORWARDED', 'REMOTE_ADDR'];
        
        foreach ($ipKeys as $key) {
            if (array_key_exists($key, $_SERVER) === true) {
                foreach (explode(',', $_SERVER[$key]) as $ip) {
                    $ip = trim($ip);
                    if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE) !== false) {
                        return $ip;
                    }
                }
            }
        }
        
        return $_SERVER['REMOTE_ADDR'] ?? 'Unknown';
    }
    
    private static function formatBytes($bytes, $precision = 2) {
        $units = array('B', 'KB', 'MB', 'GB', 'TB');
        
        for ($i = 0; $bytes > 1024 && $i < count($units) - 1; $i++) {
            $bytes /= 1024;
        }
        
        return round($bytes, $precision) . ' ' . $units[$i];
    }
    
    // Obter últimos logs
    public static function getRecentLogs($lines = 50) {
        $logDir = self::getLogDir();
        $logFile = $logDir . self::$logFile;
        if (!file_exists($logFile)) {
            return [];
        }
        
        // Para Windows, usar método alternativo ao tail
        $content = file_get_contents($logFile);
        $allLines = explode("\n", $content);
        return array_slice($allLines, -$lines);
    }
    
    // Obter logs em JSON
    public static function getRecentJsonLogs($lines = 50) {
        $logDir = self::getLogDir();
        $jsonLogFile = $logDir . str_replace('.log', '.json', self::$logFile);
        if (!file_exists($jsonLogFile)) {
            return [];
        }
        
        $content = file_get_contents($jsonLogFile);
        $jsonLines = explode("\n", trim($content));
        
        $logs = [];
        $recentLines = array_slice($jsonLines, -$lines);
        
        foreach ($recentLines as $line) {
            if (!empty($line)) {
                $decoded = json_decode($line, true);
                if ($decoded !== null) {
                    $logs[] = $decoded;
                }
            }
        }
        
        return array_reverse($logs); // Mais recentes primeiro
    }
    
    // Limpar logs antigos
    public static function rotateLogs($maxSize = 10485760) { // 10MB
        $logDir = self::getLogDir();
        $logFile = $logDir . self::$logFile;
        $jsonLogFile = $logDir . str_replace('.log', '.json', self::$logFile);
        
        foreach ([$logFile, $jsonLogFile] as $file) {
            if (file_exists($file) && filesize($file) > $maxSize) {
                $backup = $file . '.' . date('Y-m-d-H-i-s') . '.bak';
                rename($file, $backup);
                touch($file);
            }
        }
    }
}
?>