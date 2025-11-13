<?php
// Script de teste para o sistema de logging
require_once 'classes/Logger.php';

echo "=== TESTE DO SISTEMA DE LOGGING ===\n\n";

// Simular variáveis de servidor para o CLI
$_SERVER['REQUEST_METHOD'] = 'GET';
$_SERVER['REQUEST_URI'] = '/test-logging';
$_SERVER['HTTP_USER_AGENT'] = 'PHP-CLI-Test';
$_SERVER['REMOTE_ADDR'] = '127.0.0.1';

// Inicializar sessão
session_start();

echo "1. Testando criação de logs...\n";

// Testar diferentes níveis de log
Logger::debug("Teste de log DEBUG", [
    'test_type' => 'debug',
    'data' => ['key1' => 'value1', 'key2' => 'value2']
]);

Logger::info("Teste de log INFO", [
    'test_type' => 'info',
    'user_action' => 'login_attempt'
]);

Logger::warning("Teste de log WARNING", [
    'test_type' => 'warning',
    'issue' => 'usuario_nao_encontrado'
]);

Logger::error("Teste de log ERROR", [
    'test_type' => 'error',
    'error_code' => 'SQL_ERROR',
    'details' => 'Erro na consulta de login'
]);

Logger::critical("Teste de log CRITICAL", [
    'test_type' => 'critical',
    'system_failure' => 'database_connection_lost'
]);

echo "2. Logs criados com sucesso!\n\n";

// Verificar se os arquivos foram criados
$logDir = 'logs/';
$logFile = $logDir . 'system.log';
$jsonLogFile = $logDir . 'system.json';

echo "3. Verificando arquivos de log...\n";
echo "Diretório de logs existe: " . (is_dir($logDir) ? "SIM" : "NÃO") . "\n";
echo "Arquivo system.log existe: " . (file_exists($logFile) ? "SIM" : "NÃO") . "\n";
echo "Arquivo system.json existe: " . (file_exists($jsonLogFile) ? "SIM" : "NÃO") . "\n";

if (file_exists($logFile)) {
    echo "Tamanho do system.log: " . filesize($logFile) . " bytes\n";
}

if (file_exists($jsonLogFile)) {
    echo "Tamanho do system.json: " . filesize($jsonLogFile) . " bytes\n";
}

echo "\n4. Últimas linhas do log:\n";
echo str_repeat("-", 50) . "\n";

if (file_exists($logFile)) {
    $logContent = file_get_contents($logFile);
    $lines = explode("\n", trim($logContent));
    $lastLines = array_slice($lines, -10); // Últimas 10 linhas
    
    foreach ($lastLines as $line) {
        if (!empty($line)) {
            echo $line . "\n";
        }
    }
} else {
    echo "Arquivo de log não encontrado!\n";
}

echo str_repeat("-", 50) . "\n";

echo "\n5. Testando logs JSON...\n";
if (file_exists($jsonLogFile)) {
    $jsonLogs = Logger::getRecentJsonLogs(3);
    echo "Últimos 3 logs em formato JSON:\n";
    foreach ($jsonLogs as $log) {
        echo "- [" . $log['level'] . "] " . $log['message'] . " (" . $log['timestamp'] . ")\n";
    }
} else {
    echo "Arquivo JSON de log não encontrado!\n";
}

echo "\n=== TESTE CONCLUÍDO ===\n";
?>