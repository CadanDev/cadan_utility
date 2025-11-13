<?php
// Arquivo de diagnóstico para problema 404
require_once '../classes/Logger.php';

Logger::init();

// Log inicial básico
Logger::info('diagnose-404.php: Iniciando diagnóstico de 404', [
    'timestamp' => date('Y-m-d H:i:s'),
    'request_uri' => $_SERVER['REQUEST_URI'] ?? 'unknown',
    'script_name' => $_SERVER['SCRIPT_NAME'] ?? 'unknown',
    'document_root' => $_SERVER['DOCUMENT_ROOT'] ?? 'unknown',
    'file_path' => __FILE__,
    'file_exists' => file_exists(__FILE__),
    'dirname' => dirname(__FILE__),
    'auth_status_exists' => file_exists(__DIR__ . '/auth-status.php'),
    'auth_status_readable' => is_readable(__DIR__ . '/auth-status.php')
]);

// Headers básicos
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Teste de acesso aos arquivos
$diagnostics = [
    'timestamp' => date('Y-m-d H:i:s'),
    'message' => 'Diagnóstico de problema 404',
    'files_check' => [
        'auth-status.php' => [
            'exists' => file_exists(__DIR__ . '/auth-status.php'),
            'readable' => is_readable(__DIR__ . '/auth-status.php'),
            'size' => file_exists(__DIR__ . '/auth-status.php') ? filesize(__DIR__ . '/auth-status.php') : 0,
            'path' => __DIR__ . '/auth-status.php'
        ],
        'login.php' => [
            'exists' => file_exists(__DIR__ . '/login.php'),
            'readable' => is_readable(__DIR__ . '/login.php'),
            'size' => file_exists(__DIR__ . '/login.php') ? filesize(__DIR__ . '/login.php') : 0
        ]
    ],
    'server_info' => [
        'request_uri' => $_SERVER['REQUEST_URI'] ?? 'unknown',
        'script_name' => $_SERVER['SCRIPT_NAME'] ?? 'unknown',
        'document_root' => $_SERVER['DOCUMENT_ROOT'] ?? 'unknown',
        'server_name' => $_SERVER['SERVER_NAME'] ?? 'unknown',
        'request_method' => $_SERVER['REQUEST_METHOD'] ?? 'unknown'
    ],
    'directory_info' => [
        'current_dir' => __DIR__,
        'api_dir_exists' => is_dir(__DIR__),
        'api_dir_readable' => is_readable(__DIR__),
        'backend_dir_exists' => is_dir(dirname(__DIR__)),
        'backend_dir_readable' => is_readable(dirname(__DIR__))
    ]
];

// Log completo
Logger::info('diagnose-404.php: Diagnóstico completo', $diagnostics);

echo json_encode($diagnostics, JSON_PRETTY_PRINT);

Logger::info('diagnose-404.php: Resposta enviada com sucesso');
?>