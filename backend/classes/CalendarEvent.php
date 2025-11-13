<?php
require_once '../config/database.php';
require_once '../config/config.php';

class CalendarEvent {
    private $conn;
    private $table = 'calendar_events';

    public $id;
    public $user_id;
    public $title;
    public $description;
    public $event_date;
    public $event_time;

    public function __construct() {
        $database = new Database();
        $this->conn = $database->getConnection();
    }

    // Criar novo evento
    public function create() {
        $query = "INSERT INTO " . $this->table . " 
                 SET user_id = :user_id,
                     title = :title,
                     description = :description,
                     event_date = :event_date,
                     event_time = :event_time";

        $stmt = $this->conn->prepare($query);

        // Sanitizar dados
        $this->title = htmlspecialchars(strip_tags($this->title));
        $this->description = htmlspecialchars(strip_tags($this->description));

        // Bind dos parâmetros
        $stmt->bindParam(':user_id', $this->user_id);
        $stmt->bindParam(':title', $this->title);
        $stmt->bindParam(':description', $this->description);
        $stmt->bindParam(':event_date', $this->event_date);
        $stmt->bindParam(':event_time', $this->event_time);

        if ($stmt->execute()) {
            $this->id = $this->conn->lastInsertId();
            return array('success' => true, 'message' => 'Evento criado com sucesso', 'id' => $this->id);
        }

        return array('success' => false, 'message' => 'Erro ao criar evento');
    }

    // Listar eventos do usuário
    public function getUserEvents($user_id, $startDate = null, $endDate = null) {
        $query = "SELECT id, title, description, event_date, event_time, created_at
                 FROM " . $this->table . " 
                 WHERE user_id = :user_id";

        if ($startDate && $endDate) {
            $query .= " AND event_date BETWEEN :start_date AND :end_date";
        } elseif ($startDate) {
            $query .= " AND event_date >= :start_date";
        }

        $query .= " ORDER BY event_date ASC, event_time ASC";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':user_id', $user_id);
        
        if ($startDate) {
            $stmt->bindParam(':start_date', $startDate);
        }
        if ($endDate) {
            $stmt->bindParam(':end_date', $endDate);
        }

        $stmt->execute();
        $events = $stmt->fetchAll();
        
        return array(
            'success' => true, 
            'data' => $events,
            'count' => count($events)
        );
    }

    // Obter eventos futuros
    public function getUpcomingEvents($user_id, $limit = 10) {
        $query = "SELECT id, title, description, event_date, event_time
                 FROM " . $this->table . " 
                 WHERE user_id = :user_id 
                 AND (event_date > CURDATE() OR (event_date = CURDATE() AND event_time >= CURTIME()))
                 ORDER BY event_date ASC, event_time ASC
                 LIMIT :limit";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':user_id', $user_id);
        $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
        $stmt->execute();

        $events = $stmt->fetchAll();
        
        return array(
            'success' => true, 
            'data' => $events,
            'count' => count($events)
        );
    }

    // Obter eventos de uma data específica
    public function getEventsByDate($user_id, $date) {
        $query = "SELECT id, title, description, event_time
                 FROM " . $this->table . " 
                 WHERE user_id = :user_id AND event_date = :event_date
                 ORDER BY event_time ASC";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':user_id', $user_id);
        $stmt->bindParam(':event_date', $date);
        $stmt->execute();

        $events = $stmt->fetchAll();
        
        return array(
            'success' => true, 
            'data' => $events,
            'count' => count($events)
        );
    }

    // Atualizar evento
    public function update() {
        $query = "UPDATE " . $this->table . " 
                 SET title = :title,
                     description = :description,
                     event_date = :event_date,
                     event_time = :event_time
                 WHERE id = :id AND user_id = :user_id";

        $stmt = $this->conn->prepare($query);

        // Sanitizar dados
        $this->title = htmlspecialchars(strip_tags($this->title));
        $this->description = htmlspecialchars(strip_tags($this->description));

        // Bind dos parâmetros
        $stmt->bindParam(':id', $this->id);
        $stmt->bindParam(':user_id', $this->user_id);
        $stmt->bindParam(':title', $this->title);
        $stmt->bindParam(':description', $this->description);
        $stmt->bindParam(':event_date', $this->event_date);
        $stmt->bindParam(':event_time', $this->event_time);

        if ($stmt->execute() && $stmt->rowCount() > 0) {
            return array('success' => true, 'message' => 'Evento atualizado com sucesso');
        }

        return array('success' => false, 'message' => 'Erro ao atualizar evento ou evento não encontrado');
    }

    // Deletar evento
    public function delete() {
        $query = "DELETE FROM " . $this->table . " 
                 WHERE id = :id AND user_id = :user_id";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $this->id);
        $stmt->bindParam(':user_id', $this->user_id);

        if ($stmt->execute() && $stmt->rowCount() > 0) {
            return array('success' => true, 'message' => 'Evento removido com sucesso');
        }

        return array('success' => false, 'message' => 'Erro ao remover evento ou evento não encontrado');
    }

    // Obter evento por ID
    public function getById($id, $user_id) {
        $query = "SELECT * FROM " . $this->table . " 
                 WHERE id = :id AND user_id = :user_id
                 LIMIT 1";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->bindParam(':user_id', $user_id);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            $row = $stmt->fetch();
            return array('success' => true, 'data' => $row);
        }

        return array('success' => false, 'message' => 'Evento não encontrado');
    }

    // Validar dados de entrada
    public function validate($data) {
        $errors = array();

        if (empty($data['title'])) {
            $errors[] = 'Título é obrigatório';
        } elseif (strlen($data['title']) > 255) {
            $errors[] = 'Título deve ter no máximo 255 caracteres';
        }

        if (empty($data['event_date'])) {
            $errors[] = 'Data do evento é obrigatória';
        } elseif (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $data['event_date'])) {
            $errors[] = 'Data deve estar no formato YYYY-MM-DD';
        }

        if (empty($data['event_time'])) {
            $errors[] = 'Horário do evento é obrigatório';
        } elseif (!preg_match('/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/', $data['event_time'])) {
            $errors[] = 'Horário deve estar no formato HH:MM';
        }

        if (!empty($data['description']) && strlen($data['description']) > 1000) {
            $errors[] = 'Descrição deve ter no máximo 1000 caracteres';
        }

        return $errors;
    }
}
?>