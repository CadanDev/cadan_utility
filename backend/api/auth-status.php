<?php
require_once '../config/config.php';
require_once '../classes/Logger.php';

// Inicializar configurações
Config::init();
Logger::init();

// Log de início da requisição
Logger::info('auth-status.php: Requisição iniciada', [
    'request_uri' => $_SERVER['REQUEST_URI'] ?? 'unknown',
    'request_method' => $_SERVER['REQUEST_METHOD'] ?? 'unknown',
    'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? 'unknown',
    'referer' => $_SERVER['HTTP_REFERER'] ?? 'none',
    'file_path' => __FILE__
]);

// Headers CORS configuráveis
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: ' . Config::getCorsOrigin());
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: ' . Config::getCorsHeaders());

try {
    // Log do status da sessão
    Logger::debug('auth-status.php: Verificando status da sessão', [
        'session_started' => session_status() === PHP_SESSION_ACTIVE,
        'session_id' => session_id(),
        'user_id_isset' => isset($_SESSION['user_id']),
        'session_data' => $_SESSION ?? []
    ]);

    if (isset($_SESSION['user_id'])) {
        // Usuário está logado
        Logger::info('auth-status.php: Usuário autenticado encontrado', [
            'user_id' => $_SESSION['user_id'],
            'username' => $_SESSION['username'] ?? 'unknown'
        ]);
        
        echo json_encode(array(
            'success' => true,
            'authenticated' => true,
            'user' => array(
                'id' => $_SESSION['user_id'],
                'name' => $_SESSION['user_name'] ?? '',
                'username' => $_SESSION['username'] ?? ''
            )
        ));
    } else {
        // Usuário não está logado
        Logger::info('auth-status.php: Usuário não autenticado', [
            'session_keys' => array_keys($_SESSION ?? [])
        ]);
        
        echo json_encode(array(
            'success' => true,
            'authenticated' => false,
            'user' => null
        ));
    }

} catch (Exception $e) {
    Logger::error('auth-status.php: Erro capturado', [
        'error_message' => $e->getMessage(),
        'error_file' => $e->getFile(),
        'error_line' => $e->getLine(),
        'stack_trace' => $e->getTraceAsString()
    ]);
    
    http_response_code(500);
    echo json_encode(array(
        'success' => false, 
        'message' => 'Erro interno do servidor',
        'error' => Config::isDebug() ? $e->getMessage() : 'Erro interno'
    ));
}

// Log de fim da requisição
Logger::info('auth-status.php: Requisição finalizada', [
    'response_sent' => true,
    'execution_time' => microtime(true) - $_SERVER['REQUEST_TIME_FLOAT']
]);
?>