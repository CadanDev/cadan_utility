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

        // Event listener para dropdown de usuário (será adicionado após carregar)
        this.setupUserDropdown();
    },

    setupUserDropdown() {
        const dropdownToggle = document.querySelector('[data-dropdown-toggle]');
        const dropdownMenu = document.querySelector('[data-dropdown-menu]');

        if (dropdownToggle && dropdownMenu) {
            dropdownToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                dropdownMenu.classList.toggle('active');
            });

            // Fechar dropdown ao clicar fora
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.user-dropdown')) {
                    dropdownMenu.classList.remove('active');
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
                const template = document.getElementById('userAuthenticatedTemplate');
                const clone = template.content.cloneNode(true);
                
                // Preencher dados do usuário
                const avatar = clone.querySelector('[data-user-avatar]');
                const userName = clone.querySelector('[data-user-name]');
                const logoutBtn = clone.querySelector('[data-logout-btn]');
                
                // Definir avatar (pode ser do banco ou imagem padrão)
                avatar.src = data.user.avatar || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23ccc"%3E%3Cpath d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/%3E%3C/svg%3E';
                userName.textContent = data.user.name;
                logoutBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.logout();
                });
                
                userArea.innerHTML = '';
                userArea.appendChild(clone);
                
                // Configurar dropdown após adicionar ao DOM
                this.setupUserDropdown();
            } else {
                const template = document.getElementById('userGuestTemplate');
                const clone = template.content.cloneNode(true);
                
                userArea.innerHTML = '';
                userArea.appendChild(clone);
            }
        } catch (error) {
            console.error('Erro ao verificar autenticação:', error);
            const template = document.getElementById('userGuestTemplate');
            if (template) {
                const clone = template.content.cloneNode(true);
                userArea.innerHTML = '';
                userArea.appendChild(clone);
            }
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
