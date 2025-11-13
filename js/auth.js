/**
 * Gerenciador de Autenticação
 * Controla login/logout e integração com backend
 */

class AuthManager {
    constructor() {
        this.currentUser = null;
        this.baseURL = this.getBaseURL();
    }

    // Obter URL base da aplicação
    getBaseURL() {
        return window.location.origin;
    }

    // Verificar status de autenticação
    async checkAuthStatus() {
        try {
            const response = await fetch(`${this.baseURL}/backend/api/auth-status.php`, {
                method: 'GET',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            const result = await response.json();
            
            if (result.success && result.authenticated) {
                this.currentUser = result.user;
                this.showMainContent();
                this.updateUserArea();
                return true;
            } else {
                this.currentUser = null;
                this.showLoginArea();
                return false;
            }
        } catch (error) {
            console.error('Erro ao verificar autenticação:', error);
            this.showLoginArea();
            return false;
        }
    }

    // Mostrar área principal (quando logado)
    showMainContent() {
        document.getElementById('loginArea').style.display = 'none';
        document.getElementById('mainContent').style.display = 'block';
    }

    // Mostrar área de login (quando não logado)
    showLoginArea() {
        document.getElementById('loginArea').style.display = 'block';
        document.getElementById('mainContent').style.display = 'none';
    }

    // Atualizar área do usuário no navbar
    updateUserArea() {
        const userArea = document.getElementById('userArea');
        
        if (this.currentUser) {
            userArea.innerHTML = `
                <div class="dropdown">
                    <button class="btn btn-outline-primary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                        <i class="bi bi-person-circle"></i> ${this.currentUser.name}
                    </button>
                    <ul class="dropdown-menu">
                        <li><a class="dropdown-item" href="#" onclick="authManager.logout()">
                            <i class="bi bi-box-arrow-right"></i> Sair
                        </a></li>
                    </ul>
                </div>
            `;
        } else {
            userArea.innerHTML = `
                <div>
                    <a href="login.html" class="btn btn-outline-primary btn-sm me-2">Login</a>
                    <a href="register.html" class="btn btn-primary btn-sm">Cadastrar</a>
                </div>
            `;
        }
    }

    // Fazer logout
    async logout() {
        try {
            const response = await fetch(`${this.baseURL}/backend/api/logout.php`, {
                method: 'POST',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            const result = await response.json();
            
            if (result.success) {
                this.currentUser = null;
                this.showLoginArea();
                this.updateUserArea();
                
                // Limpar dados locais
                if (typeof loadMedicineReminders === 'function') {
                    document.getElementById('medicineList').innerHTML = '';
                }
                if (typeof loadEvents === 'function') {
                    document.getElementById('upcomingEventsList').innerHTML = '';
                }
                
                alert('Logout realizado com sucesso!');
            } else {
                alert('Erro ao fazer logout: ' + result.message);
            }
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
            alert('Erro ao conectar com o servidor');
        }
    }

    // Obter usuário atual
    getCurrentUser() {
        return this.currentUser;
    }

    // Verificar se está logado
    isAuthenticated() {
        return this.currentUser !== null;
    }

    // Fazer requisição autenticada
    async authenticatedFetch(url, options = {}) {
        const defaultOptions = {
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            }
        };

        const response = await fetch(url, { ...defaultOptions, ...options });
        
        // Se não autenticado, redirecionar para login
        if (response.status === 401) {
            this.currentUser = null;
            this.showLoginArea();
            this.updateUserArea();
            throw new Error('Sessão expirada. Faça login novamente.');
        }

        return response;
    }
}

// Inicializar gerenciador de autenticação
const authManager = new AuthManager();

// Verificar autenticação quando a página carregar
document.addEventListener('DOMContentLoaded', async function() {
    await authManager.checkAuthStatus();
    
    // Se logado, carregar dados
    if (authManager.isAuthenticated()) {
        // Esperar um pouco para outros scripts carregarem
        setTimeout(() => {
            if (typeof loadMedicineReminders === 'function') {
                loadMedicineRemindersFromServer();
            }
            if (typeof loadEvents === 'function') {
                loadEventsFromServer();
            }
        }, 100);
    }
});