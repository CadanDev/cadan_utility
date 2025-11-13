<?php
require_once '../config/config.php';
require_once '../classes/Logger.php';

// Inicializar configurações (inclui session_start)
Config::init();

// Headers CORS configuráveis
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: ' . Config::getCorsOrigin());
header('Access-Control-Allow-Methods: ' . Config::getCorsMethods());
header('Access-Control-Allow-Headers: ' . Config::getCorsHeaders());

// Verificar se é POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(array('success' => false, 'message' => 'Método não permitido'));
    exit;
}

require_once '../classes/User.php';

try {
    Logger::info("Requisição de login recebida", [
        'method' => $_SERVER['REQUEST_METHOD'],
        'content_type' => $_SERVER['CONTENT_TYPE'] ?? 'not_set'
    ]);
    
    // Obter dados JSON
    $input = json_decode(file_get_contents('php://input'), true);
    
    // Se não tiver JSON, tentar $_POST
    if (!$input) {
        $input = $_POST;
        Logger::debug("Usando dados POST ao invés de JSON");
    }

    Logger::debug("Dados de entrada processados", [
        'has_username' => !empty($input['username']),
        'has_password' => !empty($input['password']),
        'username_length' => isset($input['username']) ? strlen($input['username']) : 0
    ]);

    if (empty($input['username']) || empty($input['password'])) {
        Logger::warning("Login com dados faltando", [
            'username_empty' => empty($input['username']),
            'password_empty' => empty($input['password'])
        ]);
        
        http_response_code(400);
        echo json_encode(array(
            'success' => false, 
            'message' => 'Username e senha são obrigatórios'
        ));
        exit;
    }

    $user = new User();
    $user->username = $input['username'];
    $user->password = $input['password'];

    $result = $user->login();
    
    if ($result['success']) {
        // Criar sessão
        $_SESSION['user_id'] = $result['user']['id'];
        $_SESSION['user_name'] = $result['user']['name'];
        $_SESSION['username'] = $result['user']['username'];

        Logger::info("Login bem-sucedido - sessão criada", [
            'user_id' => $result['user']['id'],
            'username' => $result['user']['username'],
            'session_id' => session_id()
        ]);

        http_response_code(200);
    } else {
        Logger::warning("Falha no login", [
            'username_attempted' => $input['username'],
            'reason' => $result['message']
        ]);
        
        http_response_code(401);
    }
    
    echo json_encode($result);

} catch (Exception $e) {
    Logger::critical("Exceção no endpoint de login", [
        'error_message' => $e->getMessage(),
        'error_file' => $e->getFile(),
        'error_line' => $e->getLine(),
        'trace' => $e->getTraceAsString()
    ]);
    
    http_response_code(500);
    echo json_encode(array(
        'success' => false, 
        'message' => 'Erro interno do servidor',
        'error' => $e->getMessage()
    ));
}
?>