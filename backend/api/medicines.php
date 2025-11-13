<?php
require_once '../config/config.php';
require_once '../config/auth.php';
require_once '../classes/MedicineReminder.php';

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
    $medicine = new MedicineReminder();
    
    switch ($method) {
        case 'GET':
            // Listar lembretes do usuário
            $result = $medicine->getUserReminders($user_id);
            echo json_encode($result);
            break;
            
        case 'POST':
            // Criar novo lembrete
            $input = json_decode(file_get_contents('php://input'), true);
            
            if (!$input) {
                $input = $_POST;
            }
            
            // Validar dados
            $errors = $medicine->validate($input);
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
            $medicine->user_id = $user_id;
            $medicine->time = $input['time'];
            $medicine->medicine_name = $input['medicine_name'];
            $medicine->instructions = $input['instructions'] ?? '';
            
            $result = $medicine->create();
            
            if ($result['success']) {
                http_response_code(201);
            } else {
                http_response_code(400);
            }
            
            echo json_encode($result);
            break;
            
        case 'PUT':
            // Atualizar lembrete
            $input = json_decode(file_get_contents('php://input'), true);
            
            if (empty($input['id'])) {
                http_response_code(400);
                echo json_encode(array('success' => false, 'message' => 'ID é obrigatório'));
                exit;
            }
            
            // Validar dados
            $errors = $medicine->validate($input);
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
            $medicine->id = $input['id'];
            $medicine->user_id = $user_id;
            $medicine->time = $input['time'];
            $medicine->medicine_name = $input['medicine_name'];
            $medicine->instructions = $input['instructions'] ?? '';
            
            $result = $medicine->update();
            echo json_encode($result);
            break;
            
        case 'DELETE':
            // Deletar lembrete
            if (empty($_GET['id'])) {
                http_response_code(400);
                echo json_encode(array('success' => false, 'message' => 'ID é obrigatório'));
                exit;
            }
            
            $medicine->id = $_GET['id'];
            $medicine->user_id = $user_id;
            
            $result = $medicine->delete();
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