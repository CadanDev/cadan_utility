<?php
// Teste rápido do login após correção
require_once 'classes/User.php';
require_once 'classes/Logger.php';

// Simular ambiente web
$_SERVER['REQUEST_METHOD'] = 'POST';
$_SERVER['REQUEST_URI'] = '/test-login-fix';
$_SERVER['HTTP_USER_AGENT'] = 'PHP-CLI-Test-Login';
$_SERVER['REMOTE_ADDR'] = '127.0.0.1';

echo "=== TESTE DE LOGIN APÓS CORREÇÃO ===\n\n";

try {
    $user = new User();
    $user->username = "Cadan";
    $user->password = "123456";
    
    echo "Testando login com usuário: " . $user->username . "\n";
    echo "Senha fornecida: " . str_repeat('*', strlen($user->password)) . "\n\n";
    
    $result = $user->login();
    
    echo "Resultado do login:\n";
    echo "Success: " . ($result['success'] ? 'SIM' : 'NÃO') . "\n";
    echo "Message: " . $result['message'] . "\n";
    
    if ($result['success']) {
        echo "Dados do usuário:\n";
        print_r($result['user']);
    }
    
} catch (Exception $e) {
    echo "EXCEÇÃO: " . $e->getMessage() . "\n";
    echo "Arquivo: " . $e->getFile() . "\n";
    echo "Linha: " . $e->getLine() . "\n";
}

echo "\n=== Últimos logs ===\n";
$logs = Logger::getRecentJsonLogs(5);
foreach ($logs as $log) {
    echo "[" . $log['level'] . "] " . $log['message'] . "\n";
    if (!empty($log['context'])) {
        echo "Context: " . json_encode($log['context'], JSON_PRETTY_PRINT) . "\n";
    }
    echo "---\n";
}

echo "\n=== TESTE CONCLUÍDO ===\n";
?>