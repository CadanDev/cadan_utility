/**
 * Inicialização da aplicação
 */
function initializeApp() {
	// Solicita permissão para notificações de forma mais robusta
	requestNotificationPermission();

	// Restaura o estado do timer de descanso visual
	restoreTimerState();

	// Carrega os lembretes de medicamentos
	loadMedicineReminders();

	// Inicializa o calendário
	initializeCalendar();

	// Configura notificações para eventos do dia
	setupEventNotifications();
}

/**
 * Solicita permissão para notificações de forma robusta
 */
function requestNotificationPermission() {
	if (!("Notification" in window)) {
		console.warn("Este navegador não suporta notificações desktop");
		showPermissionInfo("Seu navegador não suporta notificações desktop. Você receberá apenas alertas visuais na página.");
		return;
	}

	if (Notification.permission === "default") {
		// Mostra um aviso antes de solicitar a permissão
		showPermissionInfo("Para receber lembretes mesmo quando a aba não estiver ativa, permita as notificações.");
		
		// Solicita a permissão apenas uma vez na inicialização
		setTimeout(() => {
			Notification.requestPermission().then(function(permission) {
				if (permission === "granted") {
					console.log("Permissão para notificações concedida");
					// Envia uma notificação de teste diretamente (sem usar sendNotification)
					try {
						const testNotification = new Notification("🎉 Notificações Ativadas!", {
							body: "Agora você receberá lembretes do Windows!",
							tag: 'permission-granted',
							icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzIiIGN5PSIzMiIgcj0iMzIiIGZpbGw9IiMxOThlNTYiLz4KPHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4PSIxNiIgeT0iMTYiPgo8cGF0aCBkPSJNMjIgMTBMMTMgMTlMOCAxNCIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIzIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+Cjwvc3ZnPg=='
						});
						testNotification.onclick = function() {
							window.focus();
							this.close();
						};
						setTimeout(() => testNotification.close(), 5000);
					} catch (error) {
						console.error('Erro ao enviar notificação de teste:', error);
					}
				} else if (permission === "denied") {
					console.warn("Permissão para notificações negada");
					showPermissionInfo("Notificações foram bloqueadas. Você receberá apenas alertas visuais na página. Para ativar, clique no ícone ao lado da barra de endereços.");
				}
			});
		}, 1000);
	} else if (Notification.permission === "denied") {
		showPermissionInfo("Notificações estão bloqueadas. Para ativar, clique no ícone de cadeado/notificação ao lado da barra de endereços.");
	} else if (Notification.permission === "granted") {
		console.log("Permissões de notificação já foram concedidas");
	}
}

/**
 * Mostra informações sobre permissões de notificação
 * @param {string} message - Mensagem a ser exibida
 */
function showPermissionInfo(message) {
	const infoHTML = `
		<div class="alert alert-info alert-dismissible fade show" role="alert">
			<i class="bi bi-info-circle me-2"></i>
			<strong>Notificações:</strong> ${message}
			<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
		</div>
	`;
	
	// Adiciona o alerta no topo da primeira seção
	const firstCard = document.querySelector('.card-body');
	if (firstCard) {
		firstCard.insertAdjacentHTML('afterbegin', infoHTML);
	}
}

// Inicializa a aplicação quando a página carregar
window.onload = initializeApp;