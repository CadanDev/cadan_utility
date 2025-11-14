<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/auth.php';
require_once __DIR__ . '/../classes/Logger.php';
require_once __DIR__ . '/../classes/FuelLog.php';

header('Content-Type: application/json');

$logger = new Logger();

try {
    $db = getDBConnection();
    $fuelLog = new FuelLog($db, $logger);

    $method = $_SERVER['REQUEST_METHOD'];

    switch ($method) {
        case 'GET':
            if (isset($_GET['id'])) {
                // Obter um abastecimento específico
                $result = $fuelLog->getById($_GET['id']);
            } else if (isset($_GET['car_id'])) {
                // Obter todos os abastecimentos de um carro
                $result = $fuelLog->getByCarId($_GET['car_id']);
            } else if (isset($_GET['statistics']) && isset($_GET['car_id'])) {
                // Obter estatísticas de um carro
                $result = $fuelLog->getStatistics($_GET['car_id']);
            } else {
                throw new Exception('Parâmetros inválidos');
            }
            echo json_encode($result);
            break;

        case 'POST':
            $data = json_decode(file_get_contents('php://input'), true);
            
            if (!$data) {
                throw new Exception('Dados inválidos');
            }

            if (!isset($data['car_id'])) {
                throw new Exception('ID do carro é obrigatório');
            }

            $result = $fuelLog->create($data);
            echo json_encode($result);
            break;

        case 'PUT':
            if (!isset($_GET['id'])) {
                throw new Exception('ID do abastecimento não fornecido');
            }

            $data = json_decode(file_get_contents('php://input'), true);
            
            if (!$data) {
                throw new Exception('Dados inválidos');
            }

            $result = $fuelLog->update($_GET['id'], $data);
            echo json_encode($result);
            break;

        case 'DELETE':
            if (!isset($_GET['id'])) {
                throw new Exception('ID do abastecimento não fornecido');
            }

            $result = $fuelLog->delete($_GET['id']);
            echo json_encode($result);
            break;

        default:
            throw new Exception('Método não suportado');
    }

} catch (Exception $e) {
    $logger->log('fuel_logs_api_error', ['error' => $e->getMessage()]);
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
