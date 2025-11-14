// Fuel Tracker Module
const FuelTracker = {
    currentCarId: null,
    currentEditCarId: null,
    currentEditLogId: null,

    init() {
        this.loadCars();
        this.setupEventListeners();
    },

    setupEventListeners() {
        // Modal de Carro
        const addCarBtn = document.getElementById('addCarBtn');
        if (addCarBtn) {
            addCarBtn.addEventListener('click', () => {
                this.showCarModal();
            });
        }

        document.getElementById('carForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveCar();
        });

        document.getElementById('cancelCarBtn').addEventListener('click', () => {
            this.closeCarModal();
        });

        // Modal de Detalhes do Carro
        document.getElementById('addFuelLogBtn').addEventListener('click', () => {
            this.showFuelLogModal();
        });

        // Modal de Abastecimento
        document.getElementById('fuelLogForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveFuelLog();
        });

        document.getElementById('cancelFuelLogBtn').addEventListener('click', () => {
            this.closeFuelLogModal();
        });

        // Tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });

        // Fechar modais ao clicar no X ou fora
        document.querySelectorAll('.modal .close').forEach(closeBtn => {
            closeBtn.addEventListener('click', (e) => {
                e.target.closest('.modal').style.display = 'none';
            });
        });

        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.style.display = 'none';
            }
        });
    },

    async loadCars() {
        try {
            const response = await fetch('backend/api/cars.php');
            const data = await response.json();

            if (data.success) {
                this.displayCars(data.cars);
            } else {
                console.error('Erro ao carregar carros:', data.message);
                this.displayCars([]);
            }
        } catch (error) {
            console.error('Erro ao carregar carros:', error);
            this.displayCars([]);
        }
    },

    displayCars(cars) {
        const carsList = document.getElementById('carsList');
        
        if (cars.length === 0) {
            carsList.innerHTML = '<p class="no-data">Nenhum carro cadastrado. Adicione seu primeiro carro!</p>';
            return;
        }

        carsList.innerHTML = cars.map(car => `
            <div class="car-card" data-id="${car.id}">
                <div class="car-card-header">
                    <h3>${car.nickname}</h3>
                    <div class="car-actions">
                        <button class="btn-icon" onclick="FuelTracker.editCar(${car.id})" title="Editar">✏️</button>
                        <button class="btn-icon" onclick="FuelTracker.deleteCar(${car.id})" title="Excluir">🗑️</button>
                    </div>
                </div>
                <div class="car-card-body">
                    <p><strong>Tipo:</strong> ${car.type}</p>
                    <p><strong>Marca:</strong> ${car.brand}</p>
                    <p><strong>Ano:</strong> ${car.year}</p>
                    <p><strong>Quilometragem:</strong> ${parseFloat(car.current_mileage).toLocaleString('pt-BR')} km</p>
                    <p><strong>Tanque:</strong> ${parseFloat(car.tank_size).toLocaleString('pt-BR')} L</p>
                </div>
                <button class="btn btn-primary btn-block" onclick="FuelTracker.viewCarDetails(${car.id})">
                    Ver Abastecimentos
                </button>
            </div>
        `).join('');
    },

    showCarModal(carData = null) {
        const modal = document.getElementById('carModal');
        const title = document.getElementById('carModalTitle');
        const form = document.getElementById('carForm');

        if (carData) {
            title.textContent = 'Editar Carro';
            document.getElementById('carType').value = carData.type;
            document.getElementById('carBrand').value = carData.brand;
            document.getElementById('carNickname').value = carData.nickname;
            document.getElementById('carYear').value = carData.year;
            document.getElementById('carMileage').value = carData.current_mileage;
            document.getElementById('carTankSize').value = carData.tank_size;
            this.currentEditCarId = carData.id;
        } else {
            title.textContent = 'Adicionar Carro';
            form.reset();
            this.currentEditCarId = null;
        }

        modal.style.display = 'block';
    },

    closeCarModal() {
        document.getElementById('carModal').style.display = 'none';
        document.getElementById('carForm').reset();
        this.currentEditCarId = null;
    },

    async saveCar() {
        const carData = {
            type: document.getElementById('carType').value,
            brand: document.getElementById('carBrand').value,
            nickname: document.getElementById('carNickname').value,
            year: parseInt(document.getElementById('carYear').value),
            current_mileage: parseFloat(document.getElementById('carMileage').value),
            tank_size: parseFloat(document.getElementById('carTankSize').value)
        };

        try {
            let url = 'backend/api/cars.php';
            let method = 'POST';

            if (this.currentEditCarId) {
                url += `?id=${this.currentEditCarId}`;
                method = 'PUT';
            }

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(carData)
            });

            const data = await response.json();

            if (data.success) {
                alert(data.message);
                this.closeCarModal();
                this.loadCars();
            } else {
                alert('Erro: ' + data.message);
            }
        } catch (error) {
            console.error('Erro ao salvar carro:', error);
            alert('Erro ao salvar carro');
        }
    },

    async editCar(carId) {
        try {
            const response = await fetch(`backend/api/cars.php?id=${carId}`);
            const data = await response.json();

            if (data.success) {
                this.showCarModal(data.car);
            } else {
                alert('Erro ao carregar dados do carro');
            }
        } catch (error) {
            console.error('Erro ao carregar carro:', error);
            alert('Erro ao carregar carro');
        }
    },

    async deleteCar(carId) {
        if (!confirm('Tem certeza que deseja excluir este carro? Todos os abastecimentos também serão excluídos.')) {
            return;
        }

        try {
            const response = await fetch(`backend/api/cars.php?id=${carId}`, {
                method: 'DELETE'
            });

            const data = await response.json();

            if (data.success) {
                alert(data.message);
                this.loadCars();
            } else {
                alert('Erro: ' + data.message);
            }
        } catch (error) {
            console.error('Erro ao excluir carro:', error);
            alert('Erro ao excluir carro');
        }
    },

    async viewCarDetails(carId) {
        this.currentCarId = carId;

        try {
            const response = await fetch(`backend/api/cars.php?id=${carId}`);
            const data = await response.json();

            if (data.success) {
                this.displayCarDetails(data.car);
                await this.loadFuelLogs(carId);
                await this.loadStatistics(carId);
                document.getElementById('carDetailsModal').style.display = 'block';
            } else {
                alert('Erro ao carregar detalhes do carro');
            }
        } catch (error) {
            console.error('Erro ao carregar detalhes:', error);
            alert('Erro ao carregar detalhes do carro');
        }
    },

    displayCarDetails(car) {
        const header = document.getElementById('carDetailsHeader');
        header.innerHTML = `
            <h2>${car.nickname}</h2>
            <div class="car-info-grid">
                <div><strong>Tipo:</strong> ${car.type}</div>
                <div><strong>Marca:</strong> ${car.brand}</div>
                <div><strong>Ano:</strong> ${car.year}</div>
                <div><strong>Quilometragem Atual:</strong> ${parseFloat(car.current_mileage).toLocaleString('pt-BR')} km</div>
                <div><strong>Tamanho do Tanque:</strong> ${parseFloat(car.tank_size).toLocaleString('pt-BR')} L</div>
            </div>
        `;
    },

    async loadFuelLogs(carId) {
        try {
            const response = await fetch(`backend/api/fuel-logs.php?car_id=${carId}`);
            const data = await response.json();

            if (data.success) {
                this.displayFuelLogs(data.logs);
            } else {
                console.error('Erro ao carregar abastecimentos:', data.message);
                this.displayFuelLogs([]);
            }
        } catch (error) {
            console.error('Erro ao carregar abastecimentos:', error);
            this.displayFuelLogs([]);
        }
    },

    displayFuelLogs(logs) {
        const logsList = document.getElementById('fuelLogsList');

        if (logs.length === 0) {
            logsList.innerHTML = '<p class="no-data">Nenhum abastecimento registrado ainda.</p>';
            return;
        }

        logsList.innerHTML = `
            <table class="fuel-logs-table">
                <thead>
                    <tr>
                        <th>Data</th>
                        <th>Combustível</th>
                        <th>Litros</th>
                        <th>Valor</th>
                        <th>R$/L</th>
                        <th>Km</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    ${logs.map(log => {
                        const date = new Date(log.log_date);
                        const pricePerLiter = parseFloat(log.amount) / parseFloat(log.liters);
                        return `
                            <tr>
                                <td>${date.toLocaleDateString('pt-BR')} ${date.toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'})}</td>
                                <td>${log.fuel_type}</td>
                                <td>${parseFloat(log.liters).toFixed(2)} L</td>
                                <td>R$ ${parseFloat(log.amount).toFixed(2)}</td>
                                <td>R$ ${pricePerLiter.toFixed(2)}</td>
                                <td>${parseFloat(log.mileage).toLocaleString('pt-BR')} km</td>
                                <td class="table-actions">
                                    <button class="btn-icon" onclick="FuelTracker.editFuelLog(${log.id})" title="Editar">✏️</button>
                                    <button class="btn-icon" onclick="FuelTracker.deleteFuelLog(${log.id})" title="Excluir">🗑️</button>
                                </td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        `;
    },

    async loadStatistics(carId) {
        try {
            const response = await fetch(`backend/api/fuel-logs.php?car_id=${carId}&statistics=1`);
            const data = await response.json();

            if (data.success) {
                this.displayStatistics(data.statistics);
            } else {
                console.error('Erro ao carregar estatísticas:', data.message);
            }
        } catch (error) {
            console.error('Erro ao carregar estatísticas:', error);
        }
    },

    displayStatistics(stats) {
        const content = document.getElementById('statisticsContent');

        if (stats.total_logs === 0) {
            content.innerHTML = '<p class="no-data">Sem dados suficientes para estatísticas.</p>';
            return;
        }

        content.innerHTML = `
            <div class="stat-card">
                <h4>Total de Abastecimentos</h4>
                <p class="stat-value">${stats.total_logs}</p>
            </div>
            <div class="stat-card">
                <h4>Total Gasto</h4>
                <p class="stat-value">R$ ${stats.total_spent.toFixed(2)}</p>
            </div>
            <div class="stat-card">
                <h4>Total de Litros</h4>
                <p class="stat-value">${stats.total_liters.toFixed(2)} L</p>
            </div>
            <div class="stat-card">
                <h4>Preço Médio por Litro</h4>
                <p class="stat-value">R$ ${stats.avg_price_per_liter.toFixed(2)}</p>
            </div>
            <div class="stat-card">
                <h4>Consumo Médio</h4>
                <p class="stat-value">${stats.avg_consumption > 0 ? stats.avg_consumption.toFixed(2) + ' km/L' : 'N/A'}</p>
            </div>
            <div class="stat-card">
                <h4>Distância Total</h4>
                <p class="stat-value">${stats.total_distance.toLocaleString('pt-BR')} km</p>
            </div>
        `;
    },

    showFuelLogModal(logData = null) {
        const modal = document.getElementById('fuelLogModal');
        const title = document.getElementById('fuelLogModalTitle');
        const form = document.getElementById('fuelLogForm');

        if (logData) {
            title.textContent = 'Editar Abastecimento';
            document.getElementById('fuelAmount').value = logData.amount;
            document.getElementById('fuelLiters').value = logData.liters;
            document.getElementById('fuelMileage').value = logData.mileage;
            document.getElementById('fuelType').value = logData.fuel_type;
            this.currentEditLogId = logData.id;
        } else {
            title.textContent = 'Registrar Abastecimento';
            form.reset();
            this.currentEditLogId = null;
        }

        modal.style.display = 'block';
    },

    closeFuelLogModal() {
        document.getElementById('fuelLogModal').style.display = 'none';
        document.getElementById('fuelLogForm').reset();
        this.currentEditLogId = null;
    },

    async saveFuelLog() {
        const logData = {
            car_id: this.currentCarId,
            amount: parseFloat(document.getElementById('fuelAmount').value),
            liters: parseFloat(document.getElementById('fuelLiters').value),
            mileage: parseFloat(document.getElementById('fuelMileage').value),
            fuel_type: document.getElementById('fuelType').value
        };

        try {
            let url = 'backend/api/fuel-logs.php';
            let method = 'POST';

            if (this.currentEditLogId) {
                url += `?id=${this.currentEditLogId}`;
                method = 'PUT';
            }

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(logData)
            });

            const data = await response.json();

            if (data.success) {
                alert(data.message);
                this.closeFuelLogModal();
                await this.loadFuelLogs(this.currentCarId);
                await this.loadStatistics(this.currentCarId);
                this.loadCars(); // Atualizar quilometragem na lista de carros
            } else {
                alert('Erro: ' + data.message);
            }
        } catch (error) {
            console.error('Erro ao salvar abastecimento:', error);
            alert('Erro ao salvar abastecimento');
        }
    },

    async editFuelLog(logId) {
        try {
            const response = await fetch(`backend/api/fuel-logs.php?id=${logId}`);
            const data = await response.json();

            if (data.success) {
                this.showFuelLogModal(data.log);
            } else {
                alert('Erro ao carregar dados do abastecimento');
            }
        } catch (error) {
            console.error('Erro ao carregar abastecimento:', error);
            alert('Erro ao carregar abastecimento');
        }
    },

    async deleteFuelLog(logId) {
        if (!confirm('Tem certeza que deseja excluir este abastecimento?')) {
            return;
        }

        try {
            const response = await fetch(`backend/api/fuel-logs.php?id=${logId}`, {
                method: 'DELETE'
            });

            const data = await response.json();

            if (data.success) {
                alert(data.message);
                await this.loadFuelLogs(this.currentCarId);
                await this.loadStatistics(this.currentCarId);
            } else {
                alert('Erro: ' + data.message);
            }
        } catch (error) {
            console.error('Erro ao excluir abastecimento:', error);
            alert('Erro ao excluir abastecimento');
        }
    },

    switchTab(tabName) {
        // Atualizar botões
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.tab === tabName) {
                btn.classList.add('active');
            }
        });

        // Atualizar conteúdo
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(tabName).classList.add('active');
    }
};

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    FuelTracker.init();
});
