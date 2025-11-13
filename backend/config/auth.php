<?php
require_once __DIR__ . '/config.php';

// Inicializar configurações (inclui session_start)
Config::init();

function checkAuth() {
    if (!isset($_SESSION['user_id'])) {
        http_response_code(401);
        echo json_encode(array(
            'success' => false, 
            'message' => 'Acesso negado. Faça login primeiro.'
        ));
        exit;
    }
}

function getCurrentUser() {
    if (isset($_SESSION['user_id'])) {
        return array(
            'id' => $_SESSION['user_id'],
            'name' => $_SESSION['user_name'],
            'username' => $_SESSION['username']
        );
    }
    return null;
}
?>