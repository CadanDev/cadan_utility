<?php
require_once '../config/config.php';

// Inicializar configurações
Config::init();

// Headers CORS configuráveis
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: ' . Config::getCorsOrigin());
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: ' . Config::getCorsHeaders());

try {
    if (isset($_SESSION['user_id'])) {
        // Usuário está logado
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
        echo json_encode(array(
            'success' => true,
            'authenticated' => false,
            'user' => null
        ));
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(array(
        'success' => false, 
        'message' => 'Erro interno do servidor',
        'error' => Config::isDebug() ? $e->getMessage() : 'Erro interno'
    ));
}
?>