<?php
require_once '../config/database.php';
require_once '../config/config.php';

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
        $query = "SELECT id, name, username, email, password 
                 FROM " . $this->table . " 
                 WHERE username = :username OR email = :username
                 LIMIT 1";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':username', $this->username);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            $row = $stmt->fetch();
            
            if (password_verify($this->password, $row['password'])) {
                $this->id = $row['id'];
                $this->name = $row['name'];
                $this->username = $row['username'];
                $this->email = $row['email'];
                
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
            }
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