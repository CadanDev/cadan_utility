<?php
require_once '../config/config.php';

// Inicializar configurações (inclui session_start)
Config::init();

// Headers CORS configuráveis
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: ' . Config::getCorsOrigin());
header('Access-Control-Allow-Methods: ' . Config::getCorsMethods());
header('Access-Control-Allow-Headers: ' . Config::getCorsHeaders());

try {
    // Destruir sessão
    session_destroy();
    
    echo json_encode(array(
        'success' => true, 
        'message' => 'Logout realizado com sucesso'
    ));

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(array(
        'success' => false, 
        'message' => 'Erro ao realizar logout',
        'error' => $e->getMessage()
    ));
}
?>