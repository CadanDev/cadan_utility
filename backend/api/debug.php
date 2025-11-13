<?php
require_once '../config/config.php';
require_once '../classes/Logger.php';

// Inicializar configurações
Config::init();

// Headers CORS
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: ' . Config::getCorsOrigin());
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: ' . Config::getCorsHeaders());

// Verificar se é GET ou POST
if ($_SERVER['REQUEST_METHOD'] !== 'GET' && $_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(array('success' => false, 'message' => 'Método não permitido'));
    exit;
}

try {
    $action = $_GET['action'] ?? 'logs';
    
    switch ($action) {
        case 'logs':
            $lines = $_GET['lines'] ?? 50;
            $format = $_GET['format'] ?? 'json'; // json ou text
            
            if ($format === 'json') {
                $logs = Logger::getRecentJsonLogs($lines);
                echo json_encode([
                    'success' => true,
                    'logs' => $logs,
                    'count' => count($logs)
                ]);
            } else {
                $logs = Logger::getRecentLogs($lines);
                echo json_encode([
                    'success' => true,
                    'logs' => $logs,
                    'count' => count($logs)
                ]);
            }
            break;
            
        case 'test':
            // Testar o sistema de logging
            Logger::debug("Teste de log DEBUG", ['test_data' => 'debug_value']);
            Logger::info("Teste de log INFO", ['test_data' => 'info_value']);
            Logger::warning("Teste de log WARNING", ['test_data' => 'warning_value']);
            Logger::error("Teste de log ERROR", ['test_data' => 'error_value']);
            
            echo json_encode([
                'success' => true,
                'message' => 'Logs de teste criados com sucesso',
                'timestamp' => date('Y-m-d H:i:s')
            ]);
            break;
            
        case 'status':
            $logDir = dirname(__DIR__) . DIRECTORY_SEPARATOR . 'logs' . DIRECTORY_SEPARATOR;
            $logFile = $logDir . 'system.log';
            $jsonLogFile = $logDir . 'system.json';
            
            $status = [
                'log_directory_exists' => is_dir($logDir),
                'log_directory_writable' => is_writable($logDir),
                'log_file_exists' => file_exists($logFile),
                'json_log_file_exists' => file_exists($jsonLogFile),
                'log_file_size' => file_exists($logFile) ? filesize($logFile) : 0,
                'json_log_file_size' => file_exists($jsonLogFile) ? filesize($jsonLogFile) : 0,
                'log_file_last_modified' => file_exists($logFile) ? date('Y-m-d H:i:s', filemtime($logFile)) : null,
                'json_log_file_last_modified' => file_exists($jsonLogFile) ? date('Y-m-d H:i:s', filemtime($jsonLogFile)) : null
            ];
            
            echo json_encode([
                'success' => true,
                'status' => $status,
                'php_error_log' => ini_get('error_log'),
                'php_log_errors' => ini_get('log_errors')
            ]);
            break;
            
        case 'clear':
            $logDir = dirname(__DIR__) . DIRECTORY_SEPARATOR . 'logs' . DIRECTORY_SEPARATOR;
            $logFile = $logDir . 'system.log';
            $jsonLogFile = $logDir . 'system.json';
            
            $cleared = [];
            if (file_exists($logFile)) {
                file_put_contents($logFile, '');
                $cleared[] = 'system.log';
            }
            if (file_exists($jsonLogFile)) {
                file_put_contents($jsonLogFile, '');
                $cleared[] = 'system.json';
            }
            
            Logger::info("Logs limpos via endpoint debug", ['cleared_files' => $cleared]);
            
            echo json_encode([
                'success' => true,
                'message' => 'Logs limpos com sucesso',
                'cleared_files' => $cleared
            ]);
            break;
            
        default:
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'Ação inválida',
                'available_actions' => ['logs', 'test', 'status', 'clear']
            ]);
            break;
    }
    
} catch (Exception $e) {
    Logger::error("Erro no endpoint debug", [
        'error_message' => $e->getMessage(),
        'error_file' => $e->getFile(),
        'error_line' => $e->getLine()
    ]);
    
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Erro interno do servidor',
        'error' => $e->getMessage()
    ]);
}
?>