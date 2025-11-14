<?php

class Car {
    private $db;
    private $logger;

    public function __construct($db, $logger = null) {
        $this->db = $db;
        $this->logger = $logger;
    }

    public function create($data) {
        try {
            $userId = $data['user_id'] ?? null;
            $sessionId = $data['session_id'] ?? null;

            // Validação: deve ter user_id OU session_id
            if (!$userId && !$sessionId) {
                throw new Exception('User ID ou Session ID é obrigatório');
            }

            $sql = "INSERT INTO cars (user_id, session_id, type, brand, nickname, year, current_mileage, tank_size) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
            
            $stmt = $this->db->prepare($sql);
            $stmt->bind_param(
                "issssidd",
                $userId,
                $sessionId,
                $data['type'],
                $data['brand'],
                $data['nickname'],
                $data['year'],
                $data['current_mileage'],
                $data['tank_size']
            );

            if ($stmt->execute()) {
                $carId = $stmt->insert_id;
                
                if ($this->logger) {
                    $this->logger->log('car_created', [
                        'car_id' => $carId,
                        'user_id' => $userId,
                        'session_id' => $sessionId
                    ]);
                }

                return [
                    'success' => true,
                    'car_id' => $carId,
                    'message' => 'Carro cadastrado com sucesso'
                ];
            }

            throw new Exception('Erro ao cadastrar carro');
        } catch (Exception $e) {
            if ($this->logger) {
                $this->logger->log('car_creation_error', ['error' => $e->getMessage()]);
            }
            return [
                'success' => false,
                'message' => $e->getMessage()
            ];
        }
    }

    public function getAll($userId = null, $sessionId = null) {
        try {
            if ($userId) {
                $sql = "SELECT * FROM cars WHERE user_id = ? ORDER BY created_at DESC";
                $stmt = $this->db->prepare($sql);
                $stmt->bind_param("i", $userId);
            } else if ($sessionId) {
                $sql = "SELECT * FROM cars WHERE session_id = ? ORDER BY created_at DESC";
                $stmt = $this->db->prepare($sql);
                $stmt->bind_param("s", $sessionId);
            } else {
                throw new Exception('User ID ou Session ID é obrigatório');
            }

            $stmt->execute();
            $result = $stmt->get_result();
            $cars = [];

            while ($row = $result->fetch_assoc()) {
                $cars[] = $row;
            }

            return [
                'success' => true,
                'cars' => $cars
            ];
        } catch (Exception $e) {
            if ($this->logger) {
                $this->logger->log('get_cars_error', ['error' => $e->getMessage()]);
            }
            return [
                'success' => false,
                'message' => $e->getMessage()
            ];
        }
    }

    public function getById($carId) {
        try {
            $sql = "SELECT * FROM cars WHERE id = ?";
            $stmt = $this->db->prepare($sql);
            $stmt->bind_param("i", $carId);
            $stmt->execute();
            $result = $stmt->get_result();

            if ($row = $result->fetch_assoc()) {
                return [
                    'success' => true,
                    'car' => $row
                ];
            }

            throw new Exception('Carro não encontrado');
        } catch (Exception $e) {
            if ($this->logger) {
                $this->logger->log('get_car_error', ['error' => $e->getMessage()]);
            }
            return [
                'success' => false,
                'message' => $e->getMessage()
            ];
        }
    }

    public function update($carId, $data) {
        try {
            $sql = "UPDATE cars SET 
                    type = ?, 
                    brand = ?, 
                    nickname = ?, 
                    year = ?, 
                    current_mileage = ?, 
                    tank_size = ? 
                    WHERE id = ?";
            
            $stmt = $this->db->prepare($sql);
            $stmt->bind_param(
                "sssiddi",
                $data['type'],
                $data['brand'],
                $data['nickname'],
                $data['year'],
                $data['current_mileage'],
                $data['tank_size'],
                $carId
            );

            if ($stmt->execute()) {
                if ($this->logger) {
                    $this->logger->log('car_updated', ['car_id' => $carId]);
                }

                return [
                    'success' => true,
                    'message' => 'Carro atualizado com sucesso'
                ];
            }

            throw new Exception('Erro ao atualizar carro');
        } catch (Exception $e) {
            if ($this->logger) {
                $this->logger->log('car_update_error', ['error' => $e->getMessage()]);
            }
            return [
                'success' => false,
                'message' => $e->getMessage()
            ];
        }
    }

    public function delete($carId) {
        try {
            $sql = "DELETE FROM cars WHERE id = ?";
            $stmt = $this->db->prepare($sql);
            $stmt->bind_param("i", $carId);

            if ($stmt->execute()) {
                if ($this->logger) {
                    $this->logger->log('car_deleted', ['car_id' => $carId]);
                }

                return [
                    'success' => true,
                    'message' => 'Carro excluído com sucesso'
                ];
            }

            throw new Exception('Erro ao excluir carro');
        } catch (Exception $e) {
            if ($this->logger) {
                $this->logger->log('car_delete_error', ['error' => $e->getMessage()]);
            }
            return [
                'success' => false,
                'message' => $e->getMessage()
            ];
        }
    }

    public function updateMileage($carId, $newMileage) {
        try {
            $sql = "UPDATE cars SET current_mileage = ? WHERE id = ?";
            $stmt = $this->db->prepare($sql);
            $stmt->bind_param("di", $newMileage, $carId);

            if ($stmt->execute()) {
                return [
                    'success' => true,
                    'message' => 'Quilometragem atualizada'
                ];
            }

            throw new Exception('Erro ao atualizar quilometragem');
        } catch (Exception $e) {
            if ($this->logger) {
                $this->logger->log('mileage_update_error', ['error' => $e->getMessage()]);
            }
            return [
                'success' => false,
                'message' => $e->getMessage()
            ];
        }
    }
}
