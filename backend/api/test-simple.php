<?php
require_once '../classes/Logger.php';

Logger::init();

Logger::info('test-simple.php: Arquivo de teste simples acessado', [
    'timestamp' => date('Y-m-d H:i:s'),
    'request_uri' => $_SERVER['REQUEST_URI'] ?? 'unknown',
    'method' => $_SERVER['REQUEST_METHOD'] ?? 'unknown',
    'file_path' => __FILE__
]);

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

echo json_encode([
    'success' => true,
    'message' => 'Arquivo de teste funcionando',
    'timestamp' => date('Y-m-d H:i:s'),
    'file' => basename(__FILE__)
]);
?>