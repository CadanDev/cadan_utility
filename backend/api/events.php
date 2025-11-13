<?php
require_once '../config/config.php';
require_once '../config/auth.php';
require_once '../classes/CalendarEvent.php';

// Inicializar configurações e verificar autenticação
Config::init();
checkAuth();

// Headers CORS configuráveis
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: ' . Config::getCorsOrigin());
header('Access-Control-Allow-Methods: ' . Config::getCorsMethods());
header('Access-Control-Allow-Headers: ' . Config::getCorsHeaders());

// Obter método HTTP
$method = $_SERVER['REQUEST_METHOD'];
$user_id = $_SESSION['user_id'];

try {
    $event = new CalendarEvent();
    
    switch ($method) {
        case 'GET':
            // Verificar parâmetros da query
            if (isset($_GET['upcoming'])) {
                // Obter eventos futuros
                $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
                $result = $event->getUpcomingEvents($user_id, $limit);
            } elseif (isset($_GET['date'])) {
                // Obter eventos de uma data específica
                $result = $event->getEventsByDate($user_id, $_GET['date']);
            } else {
                // Obter todos os eventos (com filtros opcionais)
                $startDate = $_GET['start_date'] ?? null;
                $endDate = $_GET['end_date'] ?? null;
                $result = $event->getUserEvents($user_id, $startDate, $endDate);
            }
            
            echo json_encode($result);
            break;
            
        case 'POST':
            // Criar novo evento
            $input = json_decode(file_get_contents('php://input'), true);
            
            if (!$input) {
                $input = $_POST;
            }
            
            // Validar dados
            $errors = $event->validate($input);
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
            $event->user_id = $user_id;
            $event->title = $input['title'];
            $event->description = $input['description'] ?? '';
            $event->event_date = $input['event_date'];
            $event->event_time = $input['event_time'];
            
            $result = $event->create();
            
            if ($result['success']) {
                http_response_code(201);
            } else {
                http_response_code(400);
            }
            
            echo json_encode($result);
            break;
            
        case 'PUT':
            // Atualizar evento
            $input = json_decode(file_get_contents('php://input'), true);
            
            if (empty($input['id'])) {
                http_response_code(400);
                echo json_encode(array('success' => false, 'message' => 'ID é obrigatório'));
                exit;
            }
            
            // Validar dados
            $errors = $event->validate($input);
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
            $event->id = $input['id'];
            $event->user_id = $user_id;
            $event->title = $input['title'];
            $event->description = $input['description'] ?? '';
            $event->event_date = $input['event_date'];
            $event->event_time = $input['event_time'];
            
            $result = $event->update();
            echo json_encode($result);
            break;
            
        case 'DELETE':
            // Deletar evento
            if (empty($_GET['id'])) {
                http_response_code(400);
                echo json_encode(array('success' => false, 'message' => 'ID é obrigatório'));
                exit;
            }
            
            $event->id = $_GET['id'];
            $event->user_id = $user_id;
            
            $result = $event->delete();
            echo json_encode($result);
            break;
            
        default:
            http_response_code(405);
            echo json_encode(array('success' => false, 'message' => 'Método não permitido'));
            break;
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