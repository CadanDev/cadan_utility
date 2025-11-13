<?php
/**
 * Configuração do Banco de Dados
 * As configurações são carregadas do arquivo .env
 */

require_once __DIR__ . '/config.php';

class Database {
    private $conn;

    public function __construct() {
        // Inicializar configurações
        Config::init();
        Config::validate();
    }

    // Método para conectar ao banco
    public function getConnection() {
        $this->conn = null;

        try {
            $dsn = "mysql:host=" . Config::getDbHost() . ";dbname=" . Config::getDbName() . ";charset=utf8mb4";
            
            $this->conn = new PDO(
                $dsn,
                Config::getDbUser(),
                Config::getDbPass(),
                array(
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4",
                    PDO::ATTR_EMULATE_PREPARES => false
                )
            );
        } catch(PDOException $exception) {
            if (Config::isDebug()) {
                error_log("Erro de conexão: " . $exception->getMessage());
                die("Erro na conexão com o banco de dados: " . $exception->getMessage());
            } else {
                error_log("Erro de conexão: " . $exception->getMessage());
                die("Erro na conexão com o banco de dados");
            }
        }

        return $this->conn;
    }
}
?>