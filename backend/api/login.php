<?php
require_once '../config/config.php';

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
    // Obter dados JSON
    $input = json_decode(file_get_contents('php://input'), true);
    
    // Se não tiver JSON, tentar $_POST
    if (!$input) {
        $input = $_POST;
    }

    if (empty($input['username']) || empty($input['password'])) {
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

        http_response_code(200);
    } else {
        http_response_code(401);
    }
    
    echo json_encode($result);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(array(
        'success' => false, 
        'message' => 'Erro interno do servidor',
        'error' => $e->getMessage()
    ));
}
?>