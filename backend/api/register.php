<?php
require_once '../config/config.php';

// Inicializar configurações
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

    $user = new User();
    
    // Validar dados
    $errors = $user->validate($input);
    if (!empty($errors)) {
        http_response_code(400);
        echo json_encode(array(
            'success' => false, 
            'message' => 'Dados inválidos',
            'errors' => $errors
        ));
        exit;
    }

    // Definir propriedades
    $user->name = $input['name'];
    $user->username = $input['username'];
    $user->email = $input['email'];
    $user->password = $input['password'];

    // Tentar registrar
    $result = $user->register();
    
    if ($result['success']) {
        http_response_code(201);
    } else {
        http_response_code(400);
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