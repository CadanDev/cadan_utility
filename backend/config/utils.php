<?php
/**
 * Funções utilitárias para a aplicação
 */

/**
 * Gerar resposta JSON padronizada
 */
function jsonResponse($success, $message, $data = null, $httpCode = 200) {
    http_response_code($httpCode);
    
    $response = [
        'success' => $success,
        'message' => $message,
        'timestamp' => date('Y-m-d H:i:s')
    ];
    
    if ($data !== null) {
        $response['data'] = $data;
    }
    
    echo json_encode($response, JSON_UNESCAPED_UNICODE);
    exit;
}

/**
 * Gerar resposta de erro padronizada
 */
function errorResponse($message, $httpCode = 400, $errors = null) {
    $data = null;
    if ($errors !== null) {
        $data = ['errors' => $errors];
    }
    
    jsonResponse(false, $message, $data, $httpCode);
}

/**
 * Gerar resposta de sucesso padronizada
 */
function successResponse($message, $data = null, $httpCode = 200) {
    jsonResponse(true, $message, $data, $httpCode);
}

/**
 * Sanitizar string
 */
function sanitizeString($string) {
    return htmlspecialchars(strip_tags(trim($string)));
}

/**
 * Validar email
 */
function isValidEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

/**
 * Gerar hash seguro para senha
 */
function hashPassword($password) {
    return password_hash($password, PASSWORD_DEFAULT);
}

/**
 * Verificar senha
 */
function verifyPassword($password, $hash) {
    return password_verify($password, $hash);
}

/**
 * Gerar token aleatório
 */
function generateToken($length = 32) {
    return bin2hex(random_bytes($length / 2));
}

/**
 * Log de erro personalizado
 */
function logError($message, $context = []) {
    $logMessage = date('Y-m-d H:i:s') . ' - ' . $message;
    
    if (!empty($context)) {
        $logMessage .= ' - Context: ' . json_encode($context);
    }
    
    error_log($logMessage);
}

/**
 * Verificar se requisição é AJAX
 */
function isAjaxRequest() {
    return !empty($_SERVER['HTTP_X_REQUESTED_WITH']) && 
           strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest';
}

/**
 * Obter IP do cliente
 */
function getClientIP() {
    $ipKeys = ['HTTP_CF_CONNECTING_IP', 'HTTP_CLIENT_IP', 'HTTP_X_FORWARDED_FOR', 'REMOTE_ADDR'];
    
    foreach ($ipKeys as $key) {
        if (array_key_exists($key, $_SERVER) === true) {
            foreach (explode(',', $_SERVER[$key]) as $ip) {
                $ip = trim($ip);
                if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE) !== false) {
                    return $ip;
                }
            }
        }
    }
    
    return $_SERVER['REMOTE_ADDR'] ?? 'unknown';
}

/**
 * Limitar tentativas de login (básico)
 */
function checkRateLimit($identifier, $maxAttempts = 5, $timeWindow = 300) {
    session_start();
    
    $key = 'rate_limit_' . md5($identifier);
    $now = time();
    
    if (!isset($_SESSION[$key])) {
        $_SESSION[$key] = ['attempts' => 0, 'first_attempt' => $now];
        return true;
    }
    
    $data = $_SESSION[$key];
    
    // Reset se passou do tempo limite
    if (($now - $data['first_attempt']) > $timeWindow) {
        $_SESSION[$key] = ['attempts' => 1, 'first_attempt' => $now];
        return true;
    }
    
    // Verificar se excedeu tentativas
    if ($data['attempts'] >= $maxAttempts) {
        return false;
    }
    
    $_SESSION[$key]['attempts']++;
    return true;
}
?>