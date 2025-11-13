<?php
require_once '../config/database.php';
require_once '../config/config.php';

class MedicineReminder {
    private $conn;
    private $table = 'medicine_reminders';

    public $id;
    public $user_id;
    public $time;
    public $medicine_name;
    public $instructions;
    public $is_active;

    public function __construct() {
        $database = new Database();
        $this->conn = $database->getConnection();
    }

    // Criar novo lembrete de remédio
    public function create() {
        $query = "INSERT INTO " . $this->table . " 
                 SET user_id = :user_id,
                     time = :time,
                     medicine_name = :medicine_name,
                     instructions = :instructions,
                     is_active = 1";

        $stmt = $this->conn->prepare($query);

        // Sanitizar dados
        $this->medicine_name = htmlspecialchars(strip_tags($this->medicine_name));
        $this->instructions = htmlspecialchars(strip_tags($this->instructions));

        // Bind dos parâmetros
        $stmt->bindParam(':user_id', $this->user_id);
        $stmt->bindParam(':time', $this->time);
        $stmt->bindParam(':medicine_name', $this->medicine_name);
        $stmt->bindParam(':instructions', $this->instructions);

        if ($stmt->execute()) {
            $this->id = $this->conn->lastInsertId();
            return array('success' => true, 'message' => 'Lembrete criado com sucesso', 'id' => $this->id);
        }

        return array('success' => false, 'message' => 'Erro ao criar lembrete');
    }

    // Listar lembretes do usuário
    public function getUserReminders($user_id) {
        $query = "SELECT id, time, medicine_name, instructions, is_active, created_at
                 FROM " . $this->table . " 
                 WHERE user_id = :user_id AND is_active = 1
                 ORDER BY time ASC";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':user_id', $user_id);
        $stmt->execute();

        $reminders = $stmt->fetchAll();
        
        return array(
            'success' => true, 
            'data' => $reminders,
            'count' => count($reminders)
        );
    }

    // Atualizar lembrete
    public function update() {
        $query = "UPDATE " . $this->table . " 
                 SET time = :time,
                     medicine_name = :medicine_name,
                     instructions = :instructions
                 WHERE id = :id AND user_id = :user_id";

        $stmt = $this->conn->prepare($query);

        // Sanitizar dados
        $this->medicine_name = htmlspecialchars(strip_tags($this->medicine_name));
        $this->instructions = htmlspecialchars(strip_tags($this->instructions));

        // Bind dos parâmetros
        $stmt->bindParam(':id', $this->id);
        $stmt->bindParam(':user_id', $this->user_id);
        $stmt->bindParam(':time', $this->time);
        $stmt->bindParam(':medicine_name', $this->medicine_name);
        $stmt->bindParam(':instructions', $this->instructions);

        if ($stmt->execute() && $stmt->rowCount() > 0) {
            return array('success' => true, 'message' => 'Lembrete atualizado com sucesso');
        }

        return array('success' => false, 'message' => 'Erro ao atualizar lembrete ou lembrete não encontrado');
    }

    // Deletar lembrete (soft delete)
    public function delete() {
        $query = "UPDATE " . $this->table . " 
                 SET is_active = 0 
                 WHERE id = :id AND user_id = :user_id";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $this->id);
        $stmt->bindParam(':user_id', $this->user_id);

        if ($stmt->execute() && $stmt->rowCount() > 0) {
            return array('success' => true, 'message' => 'Lembrete removido com sucesso');
        }

        return array('success' => false, 'message' => 'Erro ao remover lembrete ou lembrete não encontrado');
    }

    // Obter lembrete por ID
    public function getById($id, $user_id) {
        $query = "SELECT * FROM " . $this->table . " 
                 WHERE id = :id AND user_id = :user_id AND is_active = 1
                 LIMIT 1";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->bindParam(':user_id', $user_id);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            $row = $stmt->fetch();
            return array('success' => true, 'data' => $row);
        }

        return array('success' => false, 'message' => 'Lembrete não encontrado');
    }

    // Validar dados de entrada
    public function validate($data) {
        $errors = array();

        if (empty($data['time'])) {
            $errors[] = 'Horário é obrigatório';
        } elseif (!preg_match('/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/', $data['time'])) {
            $errors[] = 'Horário deve estar no formato HH:MM';
        }

        if (empty($data['medicine_name'])) {
            $errors[] = 'Nome do remédio é obrigatório';
        } elseif (strlen($data['medicine_name']) > 255) {
            $errors[] = 'Nome do remédio deve ter no máximo 255 caracteres';
        }

        if (!empty($data['instructions']) && strlen($data['instructions']) > 1000) {
            $errors[] = 'Instruções devem ter no máximo 1000 caracteres';
        }

        return $errors;
    }
}
?>