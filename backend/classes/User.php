<?php
// Determinar caminhos baseado na localização atual
$baseDir = dirname(__DIR__);
if (file_exists($baseDir . '/config/database.php')) {
    require_once $baseDir . '/config/database.php';
    require_once $baseDir . '/config/config.php';
} else {
    require_once 'config/database.php';
    require_once 'config/config.php';
}

class User {
    private $conn;
    private $table = 'users';

    public $id;
    public $name;
    public $username;
    public $email;
    public $password;
    public $created_at;

    public function __construct() {
        $database = new Database();
        $this->conn = $database->getConnection();
    }

    // Registrar novo usuário
    public function register() {
        // Verificar se username ou email já existem
        if ($this->userExists()) {
            return array('success' => false, 'message' => 'Username ou email já existem');
        }

        $query = "INSERT INTO " . $this->table . " 
                 SET name = :name, 
                     username = :username, 
                     email = :email, 
                     password = :password,
                     created_at = NOW()";

        $stmt = $this->conn->prepare($query);

        // Sanitizar dados
        $this->name = htmlspecialchars(strip_tags($this->name));
        $this->username = htmlspecialchars(strip_tags($this->username));
        $this->email = htmlspecialchars(strip_tags($this->email));
        $this->password = password_hash($this->password, PASSWORD_DEFAULT);

        // Bind dos parâmetros
        $stmt->bindParam(':name', $this->name);
        $stmt->bindParam(':username', $this->username);
        $stmt->bindParam(':email', $this->email);
        $stmt->bindParam(':password', $this->password);

        if ($stmt->execute()) {
            return array('success' => true, 'message' => 'Usuário cadastrado com sucesso');
        }

        return array('success' => false, 'message' => 'Erro ao cadastrar usuário');
    }

    // Login do usuário
    public function login() {
        require_once 'Logger.php';
        
        Logger::info("Tentativa de login", [
            'username_provided' => $this->username,
            'password_length' => strlen($this->password)
        ]);
        
        // Validações básicas
        if (empty($this->username) || empty($this->password)) {
            Logger::warning("Login com dados vazios", [
                'username_empty' => empty($this->username),
                'password_empty' => empty($this->password)
            ]);
            return array('success' => false, 'message' => 'Username e senha são obrigatórios');
        }
        
        try {
            $query = "SELECT id, name, username, email, password 
                     FROM " . $this->table . " 
                     WHERE username = :login OR email = :login
                     LIMIT 1";

            Logger::debug("Executando query de login", [
                'query' => $query,
                'login_param' => $this->username
            ]);

            $stmt = $this->conn->prepare($query);
            
            if (!$stmt) {
                Logger::error("Erro ao preparar statement", [
                    'error' => $this->conn->errorInfo()
                ]);
                return array('success' => false, 'message' => 'Erro interno do servidor');
            }
            
            $stmt->bindParam(':login', $this->username);
            $executeResult = $stmt->execute();
            
            if (!$executeResult) {
                Logger::error("Erro ao executar query", [
                    'error' => $stmt->errorInfo(),
                    'username' => $this->username
                ]);
                return array('success' => false, 'message' => 'Erro interno do servidor');
            }
            
            Logger::debug("Query executada com sucesso", [
                'rows_found' => $stmt->rowCount()
            ]);

            if ($stmt->rowCount() > 0) {
                $row = $stmt->fetch();
                
                Logger::debug("Usuário encontrado", [
                    'user_id' => $row['id'],
                    'username_db' => $row['username'],
                    'email_db' => $row['email']
                ]);
                
                if (password_verify($this->password, $row['password'])) {
                    $this->id = $row['id'];
                    $this->name = $row['name'];
                    $this->username = $row['username'];
                    $this->email = $row['email'];
                    
                    Logger::info("Login realizado com sucesso", [
                        'user_id' => $this->id,
                        'username' => $this->username
                    ]);
                    
                    return array(
                        'success' => true, 
                        'message' => 'Login realizado com sucesso',
                        'user' => array(
                            'id' => $this->id,
                            'name' => $this->name,
                            'username' => $this->username,
                            'email' => $this->email
                        )
                    );
                } else {
                    Logger::warning("Senha incorreta", [
                        'username' => $this->username,
                        'user_id' => $row['id']
                    ]);
                }
            } else {
                Logger::warning("Usuário não encontrado", [
                    'username_searched' => $this->username
                ]);
            }

        } catch (PDOException $e) {
            Logger::error("Erro PDO no login", [
                'error_message' => $e->getMessage(),
                'error_code' => $e->getCode(),
                'username' => $this->username
            ]);
            return array('success' => false, 'message' => 'Erro interno do servidor');
        } catch (Exception $e) {
            Logger::error("Erro geral no login", [
                'error_message' => $e->getMessage(),
                'username' => $this->username
            ]);
            return array('success' => false, 'message' => 'Erro interno do servidor');
        }

        return array('success' => false, 'message' => 'Credenciais inválidas');
    }

    // Verificar se usuário já existe
    private function userExists() {
        $query = "SELECT id FROM " . $this->table . " 
                 WHERE username = :username OR email = :email 
                 LIMIT 1";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':username', $this->username);
        $stmt->bindParam(':email', $this->email);
        $stmt->execute();

        return $stmt->rowCount() > 0;
    }

    // Validar dados de entrada
    public function validate($data) {
        $errors = array();
        
        $minUsernameLength = Config::getUsernameMinLength();
        $minPasswordLength = Config::getPasswordMinLength();

        if (empty($data['name'])) {
            $errors[] = 'Nome é obrigatório';
        }

        if (empty($data['username'])) {
            $errors[] = 'Username é obrigatório';
        } elseif (strlen($data['username']) < $minUsernameLength) {
            $errors[] = "Username deve ter pelo menos {$minUsernameLength} caracteres";
        }

        if (empty($data['email'])) {
            $errors[] = 'Email é obrigatório';
        } elseif (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            $errors[] = 'Email inválido';
        }

        if (empty($data['password'])) {
            $errors[] = 'Senha é obrigatória';
        } elseif (strlen($data['password']) < $minPasswordLength) {
            $errors[] = "Senha deve ter pelo menos {$minPasswordLength} caracteres";
        }

        return $errors;
    }
}
?>