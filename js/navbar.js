// Navbar Module
const Navbar = {
    init() {
        this.loadNavbar();
        this.setupEventListeners();
        this.updateUserArea();
        this.highlightCurrentPage();
    },

    async loadNavbar() {
        try {
            const response = await fetch('components/navbar.html');
            const html = await response.text();
            
            // Inserir navbar no início do body
            document.body.insertAdjacentHTML('afterbegin', html);
            
            // Configurar após carregar
            this.setupEventListeners();
            this.updateUserArea();
            this.highlightCurrentPage();
        } catch (error) {
            console.error('Erro ao carregar navbar:', error);
        }
    },

    setupEventListeners() {
        const toggle = document.getElementById('navbarToggle');
        const menu = document.getElementById('navbarMenu');

        if (toggle && menu) {
            toggle.addEventListener('click', () => {
                menu.classList.toggle('active');
            });

            // Fechar menu ao clicar fora
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.main-navbar')) {
                    menu.classList.remove('active');
                }
            });
        }
    },

    async updateUserArea() {
        const userArea = document.getElementById('navbarUser');
        if (!userArea) return;

        try {
            const response = await fetch('backend/api/auth-status.php');
            const data = await response.json();

            if (data.authenticated) {
                userArea.innerHTML = `
                    <div class="user-info">
                        <span class="user-name">
                            <i class="bi bi-person-circle"></i> ${data.user.name}
                        </span>
                        <button class="btn-logout" onclick="Navbar.logout()">
                            <i class="bi bi-box-arrow-right"></i> Sair
                        </button>
                    </div>
                `;
            } else {
                userArea.innerHTML = `
                    <div class="user-info">
                        <span class="guest-mode">
                            <i class="bi bi-person"></i> Modo Visitante
                        </span>
                        <a href="login.html" class="btn-login">
                            <i class="bi bi-box-arrow-in-right"></i> Entrar
                        </a>
                    </div>
                `;
            }
        } catch (error) {
            console.error('Erro ao verificar autenticação:', error);
            userArea.innerHTML = `
                <div class="user-info">
                    <a href="login.html" class="btn-login">
                        <i class="bi bi-box-arrow-in-right"></i> Entrar
                    </a>
                </div>
            `;
        }
    },

    highlightCurrentPage() {
        const currentPath = window.location.pathname;
        const fileName = currentPath.split('/').pop() || 'index.html';
        
        const links = document.querySelectorAll('.navbar-menu a');
        links.forEach(link => {
            const linkPath = link.getAttribute('href');
            if (linkPath === fileName) {
                link.classList.add('active');
            }
        });
    },

    async logout() {
        if (!confirm('Tem certeza que deseja sair?')) {
            return;
        }

        try {
            const response = await fetch('backend/api/logout.php');
            const data = await response.json();

            if (data.success) {
                window.location.href = 'index.html';
            } else {
                alert('Erro ao fazer logout');
            }
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
            alert('Erro ao fazer logout');
        }
    }
};

// Inicializar quando o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => Navbar.init());
} else {
    Navbar.init();
}
