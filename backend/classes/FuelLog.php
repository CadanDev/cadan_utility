<?php

class FuelLog {
    private $db;
    private $logger;

    public function __construct($db, $logger = null) {
        $this->db = $db;
        $this->logger = $logger;
    }

    public function create($data) {
        try {
            $sql = "INSERT INTO fuel_logs (car_id, amount, liters, mileage, fuel_type) 
                    VALUES (?, ?, ?, ?, ?)";
            
            $stmt = $this->db->prepare($sql);
            $stmt->bind_param(
                "iddds",
                $data['car_id'],
                $data['amount'],
                $data['liters'],
                $data['mileage'],
                $data['fuel_type']
            );

            if ($stmt->execute()) {
                $logId = $stmt->insert_id;
                
                // Atualizar quilometragem atual do carro
                $this->updateCarMileage($data['car_id'], $data['mileage']);

                if ($this->logger) {
                    $this->logger->log('fuel_log_created', [
                        'log_id' => $logId,
                        'car_id' => $data['car_id']
                    ]);
                }

                return [
                    'success' => true,
                    'log_id' => $logId,
                    'message' => 'Abastecimento registrado com sucesso'
                ];
            }

            throw new Exception('Erro ao registrar abastecimento');
        } catch (Exception $e) {
            if ($this->logger) {
                $this->logger->log('fuel_log_creation_error', ['error' => $e->getMessage()]);
            }
            return [
                'success' => false,
                'message' => $e->getMessage()
            ];
        }
    }

    public function getByCarId($carId) {
        try {
            $sql = "SELECT * FROM fuel_logs WHERE car_id = ? ORDER BY log_date DESC";
            $stmt = $this->db->prepare($sql);
            $stmt->bind_param("i", $carId);
            $stmt->execute();
            $result = $stmt->get_result();
            $logs = [];

            while ($row = $result->fetch_assoc()) {
                $logs[] = $row;
            }

            return [
                'success' => true,
                'logs' => $logs
            ];
        } catch (Exception $e) {
            if ($this->logger) {
                $this->logger->log('get_fuel_logs_error', ['error' => $e->getMessage()]);
            }
            return [
                'success' => false,
                'message' => $e->getMessage()
            ];
        }
    }

    public function getById($logId) {
        try {
            $sql = "SELECT * FROM fuel_logs WHERE id = ?";
            $stmt = $this->db->prepare($sql);
            $stmt->bind_param("i", $logId);
            $stmt->execute();
            $result = $stmt->get_result();

            if ($row = $result->fetch_assoc()) {
                return [
                    'success' => true,
                    'log' => $row
                ];
            }

            throw new Exception('Abastecimento não encontrado');
        } catch (Exception $e) {
            if ($this->logger) {
                $this->logger->log('get_fuel_log_error', ['error' => $e->getMessage()]);
            }
            return [
                'success' => false,
                'message' => $e->getMessage()
            ];
        }
    }

    public function update($logId, $data) {
        try {
            $sql = "UPDATE fuel_logs SET 
                    amount = ?, 
                    liters = ?, 
                    mileage = ?, 
                    fuel_type = ? 
                    WHERE id = ?";
            
            $stmt = $this->db->prepare($sql);
            $stmt->bind_param(
                "dddsi",
                $data['amount'],
                $data['liters'],
                $data['mileage'],
                $data['fuel_type'],
                $logId
            );

            if ($stmt->execute()) {
                if ($this->logger) {
                    $this->logger->log('fuel_log_updated', ['log_id' => $logId]);
                }

                return [
                    'success' => true,
                    'message' => 'Abastecimento atualizado com sucesso'
                ];
            }

            throw new Exception('Erro ao atualizar abastecimento');
        } catch (Exception $e) {
            if ($this->logger) {
                $this->logger->log('fuel_log_update_error', ['error' => $e->getMessage()]);
            }
            return [
                'success' => false,
                'message' => $e->getMessage()
            ];
        }
    }

    public function delete($logId) {
        try {
            $sql = "DELETE FROM fuel_logs WHERE id = ?";
            $stmt = $this->db->prepare($sql);
            $stmt->bind_param("i", $logId);

            if ($stmt->execute()) {
                if ($this->logger) {
                    $this->logger->log('fuel_log_deleted', ['log_id' => $logId]);
                }

                return [
                    'success' => true,
                    'message' => 'Abastecimento excluído com sucesso'
                ];
            }

            throw new Exception('Erro ao excluir abastecimento');
        } catch (Exception $e) {
            if ($this->logger) {
                $this->logger->log('fuel_log_delete_error', ['error' => $e->getMessage()]);
            }
            return [
                'success' => false,
                'message' => $e->getMessage()
            ];
        }
    }

    public function getStatistics($carId) {
        try {
            $sql = "SELECT 
                    COUNT(*) as total_logs,
                    SUM(amount) as total_spent,
                    SUM(liters) as total_liters,
                    AVG(amount / liters) as avg_price_per_liter,
                    MAX(mileage) as max_mileage,
                    MIN(mileage) as min_mileage
                    FROM fuel_logs 
                    WHERE car_id = ?";
            
            $stmt = $this->db->prepare($sql);
            $stmt->bind_param("i", $carId);
            $stmt->execute();
            $result = $stmt->get_result();

            if ($row = $result->fetch_assoc()) {
                // Calcular consumo médio
                $mileageDiff = $row['max_mileage'] - $row['min_mileage'];
                $avgConsumption = ($mileageDiff > 0 && $row['total_liters'] > 0) 
                    ? $mileageDiff / $row['total_liters'] 
                    : 0;

                return [
                    'success' => true,
                    'statistics' => [
                        'total_logs' => (int)$row['total_logs'],
                        'total_spent' => (float)$row['total_spent'],
                        'total_liters' => (float)$row['total_liters'],
                        'avg_price_per_liter' => (float)$row['avg_price_per_liter'],
                        'avg_consumption' => round($avgConsumption, 2),
                        'total_distance' => round($mileageDiff, 2)
                    ]
                ];
            }

            throw new Exception('Erro ao calcular estatísticas');
        } catch (Exception $e) {
            if ($this->logger) {
                $this->logger->log('fuel_statistics_error', ['error' => $e->getMessage()]);
            }
            return [
                'success' => false,
                'message' => $e->getMessage()
            ];
        }
    }

    private function updateCarMileage($carId, $newMileage) {
        try {
            $sql = "UPDATE cars SET current_mileage = ? WHERE id = ?";
            $stmt = $this->db->prepare($sql);
            $stmt->bind_param("di", $newMileage, $carId);
            $stmt->execute();
        } catch (Exception $e) {
            if ($this->logger) {
                $this->logger->log('car_mileage_update_error', ['error' => $e->getMessage()]);
            }
        }
    }
}
