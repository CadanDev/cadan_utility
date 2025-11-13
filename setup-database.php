<?php
/**
 * SCRIPT DE VERIFICAÇÃO E SETUP DO BANCO
 * Execute este arquivo UMA VEZ para verificar/criar as tabelas
 */

require_once 'backend/config/config.php';

// Inicializar configurações
Config::init();

try {
    $pdo = new PDO(
        "mysql:host=" . Config::getDbHost() . ";dbname=" . Config::getDbName() . ";charset=utf8mb4",
        Config::getDbUser(),
        Config::getDbPass(),
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
        ]
    );
    
    echo "<h2>🧪 Setup e Verificação do Banco de Dados</h2>";
    
    // Verificar tabelas existentes
    $stmt = $pdo->query("SHOW TABLES");
    $existingTables = $stmt->fetchAll(PDO::FETCH_COLUMN);
    
    echo "<h3>📋 Tabelas Existentes:</h3>";
    if (count($existingTables) > 0) {
        echo "<ul>";
        foreach ($existingTables as $table) {
            echo "<li>✅ $table</li>";
        }
        echo "</ul>";
    } else {
        echo "<p style='color: orange;'>⚠️ Nenhuma tabela encontrada!</p>";
    }
    
    // Verificar se tabelas necessárias existem
    $requiredTables = ['users', 'medicine_reminders', 'calendar_events'];
    $missingTables = array_diff($requiredTables, $existingTables);
    
    if (!empty($missingTables)) {
        echo "<h3>❌ Tabelas Faltando:</h3>";
        echo "<ul>";
        foreach ($missingTables as $table) {
            echo "<li style='color: red;'>$table</li>";
        }
        echo "</ul>";
        
        echo "<div style='background: #fff3cd; padding: 15px; border: 1px solid #ffeaa7; border-radius: 5px; margin: 20px 0;'>";
        echo "<h4>🛠️ AÇÃO NECESSÁRIA:</h4>";
        echo "<p>Execute o script SQL no phpMyAdmin:</p>";
        echo "<ol>";
        echo "<li>Acesse phpMyAdmin no painel Hostinger</li>";
        echo "<li>Selecione o banco: <code>" . Config::getDbName() . "</code></li>";
        echo "<li>Vá na aba 'SQL'</li>";
        echo "<li>Cole e execute o conteúdo do arquivo <code>backend/database.sql</code></li>";
        echo "</ol>";
        echo "</div>";
        
    } else {
        echo "<div style='background: #d4edda; padding: 15px; border: 1px solid #c3e6cb; border-radius: 5px; margin: 20px 0;'>";
        echo "<h4>✅ TODAS AS TABELAS ESTÃO OK!</h4>";
        echo "<p>O banco está configurado corretamente.</p>";
        echo "</div>";
        
        // Verificar se existe pelo menos um usuário
        $stmt = $pdo->query("SELECT COUNT(*) as count FROM users");
        $userCount = $stmt->fetch()['count'];
        
        echo "<h3>👥 Usuários no Sistema:</h3>";
        echo "<p>Usuários cadastrados: <strong>$userCount</strong></p>";
        
        if ($userCount == 0) {
            echo "<div style='background: #f8d7da; padding: 15px; border: 1px solid #f5c6cb; border-radius: 5px; margin: 20px 0;'>";
            echo "<h4>⚠️ NENHUM USUÁRIO CADASTRADO</h4>";
            echo "<p>Faça seu primeiro cadastro em: <a href='register.html'>register.html</a></p>";
            echo "</div>";
        }
    }
    
    // Testar consulta de login
    echo "<h3>🔐 Teste de Funcionalidade:</h3>";
    try {
        $testQuery = "SELECT id, name, username, email FROM users WHERE username = :login OR email = :login LIMIT 1";
        $testStmt = $pdo->prepare($testQuery);
        $testStmt->bindValue(':login', 'test');
        $testStmt->execute();
        echo "<p style='color: green;'>✅ Query de login funcionando corretamente</p>";
    } catch (Exception $e) {
        echo "<p style='color: red;'>❌ Erro na query de login: " . $e->getMessage() . "</p>";
    }
    
} catch (PDOException $e) {
    echo "<div style='color: red; padding: 15px; border: 1px solid red; background: #f8d7da; border-radius: 5px;'>";
    echo "<h3>❌ ERRO DE CONEXÃO:</h3>";
    echo "<p><strong>Código:</strong> " . $e->getCode() . "</p>";
    echo "<p><strong>Mensagem:</strong> " . $e->getMessage() . "</p>";
    echo "</div>";
}

echo "<hr>";
echo "<p><strong>🗑️ IMPORTANTE:</strong> Remova este arquivo após verificar tudo!</p>";
?>

<style>
body { 
    font-family: Arial, sans-serif; 
    max-width: 900px; 
    margin: 20px auto; 
    line-height: 1.6;
    padding: 20px;
}
code {
    background: #f4f4f4;
    padding: 2px 6px;
    border-radius: 3px;
    font-family: monospace;
}
</style>