<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/auth.php';
require_once __DIR__ . '/../classes/Logger.php';
require_once __DIR__ . '/../classes/Car.php';

header('Content-Type: application/json');

$logger = new Logger();

try {
    $db = getDBConnection();
    $car = new Car($db, $logger);

    // Verificar se o usuário está logado ou obter session_id
    $userId = null;
    $sessionId = null;

    if (isAuthenticated()) {
        $userData = getCurrentUser();
        $userId = $userData['id'];
    } else {
        // Para usuários não logados, usar session_id
        if (!isset($_COOKIE['session_id'])) {
            $sessionId = uniqid('guest_', true);
            setcookie('session_id', $sessionId, time() + (86400 * 365), '/'); // 1 ano
        } else {
            $sessionId = $_COOKIE['session_id'];
        }
    }

    $method = $_SERVER['REQUEST_METHOD'];

    switch ($method) {
        case 'GET':
            if (isset($_GET['id'])) {
                // Obter um carro específico
                $result = $car->getById($_GET['id']);
            } else {
                // Obter todos os carros do usuário ou sessão
                $result = $car->getAll($userId, $sessionId);
            }
            echo json_encode($result);
            break;

        case 'POST':
            $data = json_decode(file_get_contents('php://input'), true);
            
            if (!$data) {
                throw new Exception('Dados inválidos');
            }

            // Adicionar user_id ou session_id aos dados
            $data['user_id'] = $userId;
            $data['session_id'] = $sessionId;

            $result = $car->create($data);
            echo json_encode($result);
            break;

        case 'PUT':
            if (!isset($_GET['id'])) {
                throw new Exception('ID do carro não fornecido');
            }

            $data = json_decode(file_get_contents('php://input'), true);
            
            if (!$data) {
                throw new Exception('Dados inválidos');
            }

            $result = $car->update($_GET['id'], $data);
            echo json_encode($result);
            break;

        case 'DELETE':
            if (!isset($_GET['id'])) {
                throw new Exception('ID do carro não fornecido');
            }

            $result = $car->delete($_GET['id']);
            echo json_encode($result);
            break;

        default:
            throw new Exception('Método não suportado');
    }

} catch (Exception $e) {
    $logger->log('cars_api_error', ['error' => $e->getMessage()]);
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
