// Variáveis globais para utilidades
let audio = null;
let progressInterval = null;
let continuousMedicineAudio = null;
let notificationPermissionRequested = false;

/**
 * Reproduz um som de alerta
 */
function playSound() {
	if (!audio) {
		// Som mais suave e agradável
		audio = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
		audio.volume = 0.6; // Volume moderado (0.0 a 1.0)
		audio.loop = false;
	}
	audio.currentTime = 0;
	audio.play().catch(e => {
		console.log('Erro ao reproduzir som:', e);
	});
}

/**
 * Reproduz um som de alerta suave (versão menos intrusiva)
 */
function playSoftSound() {
	let softAudio = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
	softAudio.volume = 0.5;
	softAudio.currentTime = 0;
	softAudio.play().catch(e => {
		console.log('Erro ao reproduzir som suave:', e);
	});
}

/**
 * Reproduz um som de alerta contínuo para medicamentos
 */
function playContinuousMedicineSound() {
	if (!continuousMedicineAudio) {
		continuousMedicineAudio = new Audio('https://actions.google.com/sounds/v1/alarms/medium_bell_ringing_near.ogg');
		continuousMedicineAudio.volume = 0.8;
		continuousMedicineAudio.loop = true; // Som em loop
	}
	continuousMedicineAudio.currentTime = 0;
	continuousMedicineAudio.play().catch(e => {
		console.log('Erro ao reproduzir som contínuo:', e);
	});
}

/**
 * Para o som contínuo de medicamento
 */
function stopContinuousMedicineSound() {
	if (continuousMedicineAudio) {
		continuousMedicineAudio.pause();
		continuousMedicineAudio.currentTime = 0;
	}
}

/**
 * Envia uma notificação para o usuário
 * @param {string} title - Título da notificação
 * @param {string} body - Corpo da mensagem
 * @param {Object} options - Opções adicionais para a notificação
 */
function sendNotification(title, body, options = {}) {
	// Verifica se as notificações são suportadas pelo navegador
	if (!("Notification" in window)) {
		console.warn("Este navegador não suporta notificações desktop");
		showFallbackNotification(title, body);
		return;
	}

	// Se já temos permissão, envia a notificação
	if (Notification.permission === "granted") {
		const notificationOptions = {
			body: body,
			icon: options.icon || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzIiIGN5PSIzMiIgcj0iMzIiIGZpbGw9IiMwMDc4ZDQiLz4KPHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4PSIxNiIgeT0iMTYiPgo8cGF0aCBkPSJNMTYgNEM5LjM3MjU4IDQgNCA5LjM3MjU4IDQgMTZDNCAyMi42Mjc0IDkuMzcyNTggMjggMTYgMjhDMjIuNjI3NCAyOCAyOCAyMi42Mjc0IDI4IDE2QzI4IDkuMzcyNTggMjIuNjI3NCA0IDE2IDRaIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiLz4KPHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4PSI4IiB5PSI4Ij4KPHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIGZpbGw9IndoaXRlIiB2aWV3Qm94PSIwIDAgMTYgMTYiPgogIDxwYXRoIGQ9Im04IDMgNCA0LjUtNCBoLTFhMi41IDIuNSAwIDEgMSAwLTV6Ii8+Cjwvc3ZnPgo8L3N2Zz4KPC9zdmc+Cjwvc3ZnPg==',
			badge: options.badge || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzIiIGN5PSIzMiIgcj0iMzIiIGZpbGw9IiNkYzM1NDUiLz4KPHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4PSIxNiIgeT0iMTYiPgo8cGF0aCBkPSJNMTYgNEM5LjM3MjU4IDQgNCA5LjM3MjU4IDQgMTZDNCAyMi42Mjc0IDkuMzcyNTggMjggMTYgMjhDMjIuNjI3NCAyOCAyOCAyMi42Mjc0IDI4IDE2QzI4IDkuMzcyNTggMjIuNjI3NCA0IDE2IDRaIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiLz4KPHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4PSI4IiB5PSI4Ij4KPHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIGZpbGw9IndoaXRlIiB2aWV3Qm94PSIwIDAgMTYgMTYiPgogIDxwYXRoIGQ9Im0xMy40OTggNS4xNTctMS42MzUtMS42MzZMOCA3LjM2NSA0LjEzNyAzLjUyMSAyLjUwMiA1LjE1N0w2LjM2NCA5bC0zLjg2MiAzLjg0MyAxLjYzNSAxLjYzNkw4IDEwLjYzNWwzLjg2MyAzLjg0NCAxLjYzNS0xLjYzNkw5LjYzNiA5eiIvPgo8L3N2Zz4KPC9zdmc+Cjwvc3ZnPgo8L3N2Zz4=',
			tag: options.tag || 'lembretes-app',
			requireInteraction: options.requireInteraction || false,
			silent: options.silent || false,
			...options
		};

		try {
			const notification = new Notification(title, notificationOptions);
			
			// Adiciona eventos à notificação
			notification.onclick = function() {
				window.focus();
				this.close();
				if (options.onclick) options.onclick();
			};

			// Auto-fecha após 10 segundos se não for para medicamentos
			if (!options.requireInteraction && !title.includes('Remédio')) {
				setTimeout(() => {
					notification.close();
				}, 10000);
			}

			return notification;
		} catch (error) {
			console.error('Erro ao criar notificação:', error);
			showFallbackNotification(title, body);
		}
	} 
	// Se não temos permissão, mostra fallback (não solicita mais)
	else if (Notification.permission !== "denied") {
		console.log("Permissão de notificação pendente - usando fallback");
		showFallbackNotification(title, body);
	} 
	// Se foi negada, mostra notificação visual alternativa
	else {
		console.warn("Notificações foram negadas pelo usuário");
		showFallbackNotification(title, body);
	}
}

/**
 * Exibe uma notificação visual alternativa quando as notificações do sistema não estão disponíveis
 * @param {string} title - Título da notificação
 * @param {string} body - Corpo da mensagem
 */
function showFallbackNotification(title, body) {
	// Remove notificação anterior se existir
	const existingFallback = document.getElementById('fallbackNotification');
	if (existingFallback) {
		existingFallback.remove();
	}

	// Cria uma notificação visual na página
	const fallbackHTML = `
		<div id="fallbackNotification" class="position-fixed top-0 end-0 m-3" style="z-index: 9999; max-width: 350px;">
			<div class="alert alert-warning alert-dismissible fade show shadow-lg" role="alert">
				<div class="d-flex align-items-center">
					<i class="bi bi-exclamation-triangle-fill me-2" style="font-size: 1.2rem;"></i>
					<div>
						<strong>${title}</strong><br>
						<span class="small">${body}</span>
					</div>
				</div>
				<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
			</div>
		</div>
	`;

	document.body.insertAdjacentHTML('beforeend', fallbackHTML);

	// Remove automaticamente após 8 segundos
	setTimeout(() => {
		const notification = document.getElementById('fallbackNotification');
		if (notification) {
			notification.remove();
		}
	}, 8000);
}

/**
 * Atualiza a barra de progresso
 * @param {number} duration - Duração total em milissegundos
 * @param {HTMLElement} progressBar - Elemento da barra de progresso
 * @param {number} startTime - Tempo de início (opcional)
 */
function updateProgress(duration, progressBar, startTime = null) {
	let start = startTime || Date.now();
	clearInterval(progressInterval);
	progressInterval = setInterval(() => {
		let elapsed = Date.now() - start;
		let percent = Math.min((elapsed / duration) * 100, 100);
		progressBar.style.width = percent + "%";
		progressBar.setAttribute("aria-valuenow", percent);
		if (percent >= 100) {
			clearInterval(progressInterval);
		}
	}, 1000);
}

/**
 * Exibe um modal de alerta para lembrete de medicamento
 * @param {string} medicineText - Texto do medicamento
 */
function showMedicineAlert(medicineText) {
	// Se já existe um modal, não cria outro
	if (document.getElementById('medicineAlertModal')) {
		return;
	}
	
	// Para qualquer som contínuo anterior
	stopContinuousMedicineSound();
	
	// Inicia o som contínuo
	playContinuousMedicineSound();
	
	// Remove modal anterior se existir
	const existingModal = document.getElementById('medicineAlertModal');
	if (existingModal) {
		existingModal.remove();
	}
	
	// Cria o modal
	const modalHTML = `
		<div class="modal fade show" id="medicineAlertModal" tabindex="-1" style="display: block; background-color: rgba(0,0,0,0.9);">
			<div class="modal-dialog modal-dialog-centered">
				<div class="modal-content border-danger medicine-alert-pulse" style="border-width: 4px; box-shadow: 0 0 30px rgba(220, 53, 69, 0.8);">
					<div class="modal-header bg-danger text-white">
						<h5 class="modal-title">
							<i class="bi bi-capsule me-2 medicine-icon-spin"></i>
							⏰ Hora do Medicamento!
						</h5>
					</div>
					<div class="modal-body text-center">
						<div class="mb-3">
							<i class="bi bi-exclamation-triangle-fill text-warning medicine-warning-blink" style="font-size: 3rem;"></i>
						</div>
						<h4 class="text-primary">${medicineText}</h4>
						<p class="text-muted">Não esqueça de tomar seu medicamento!</p>
						<div class="alert alert-warning">
							<i class="bi bi-volume-up me-2"></i>
							<strong>O som continuará tocando até você confirmar</strong>
						</div>
					</div>
					<div class="modal-footer justify-content-center">
						<button type="button" class="btn btn-success btn-lg me-3" onclick="dismissMedicineAlert()" style="min-width: 200px;">
							<i class="bi bi-check-circle me-2"></i>
							✅ Tomei o Medicamento
						</button>
						<button type="button" class="btn btn-secondary btn-lg" onclick="dismissMedicineAlert()" style="min-width: 120px;">
							<i class="bi bi-x-circle me-2"></i>
							Ignorar
						</button>
					</div>
				</div>
			</div>
		</div>
		<style>
			.medicine-alert-pulse {
				animation: medicineAlertPulse 2s ease-in-out infinite alternate;
			}
			
			.medicine-warning-blink {
				animation: warningBlink 1s ease-in-out infinite alternate;
			}
			
			.medicine-icon-spin {
				animation: medicineIconSpin 3s linear infinite;
			}
			
			@keyframes medicineAlertPulse {
				0% { transform: scale(1); }
				100% { transform: scale(1.02); }
			}
			
			@keyframes warningBlink {
				0% { opacity: 1; }
				100% { opacity: 0.5; }
			}
			
			@keyframes medicineIconSpin {
				0% { transform: rotate(0deg); }
				100% { transform: rotate(360deg); }
			}
		</style>
	`;
	
	// Adiciona o modal ao body
	document.body.insertAdjacentHTML('beforeend', modalHTML);
	
	// Foca no botão principal para permitir fechar com Enter
	setTimeout(() => {
		const successBtn = document.querySelector('#medicineAlertModal .btn-success');
		if (successBtn) successBtn.focus();
	}, 100);
}

/**
 * Fecha o modal de alerta de medicamento e para o som
 */
function dismissMedicineAlert() {
	// Para o som contínuo
	stopContinuousMedicineSound();
	
	// Remove o modal
	const modal = document.getElementById('medicineAlertModal');
	if (modal) {
		modal.remove();
	}
}

// Adiciona listener para fechar modal com ESC
document.addEventListener('keydown', function(event) {
	if (event.key === 'Escape') {
		const modal = document.getElementById('medicineAlertModal');
		if (modal) {
			dismissMedicineAlert();
		}
	}
});

// Adiciona listener para fechar modal com Enter quando focado no botão
document.addEventListener('keydown', function(event) {
	if (event.key === 'Enter') {
		const modal = document.getElementById('medicineAlertModal');
		if (modal && document.activeElement.classList.contains('btn')) {
			dismissMedicineAlert();
		}
	}
});

/**
 * Verifica e exibe o status das notificações
 */
function checkNotificationStatus() {
	if (!("Notification" in window)) {
		return "❌ Não suportado - Seu navegador não suporta notificações desktop.";
	}
	
	switch (Notification.permission) {
		case "granted":
			return "✅ Ativado - Você receberá notificações do Windows.";
		case "denied":
			return "❌ Bloqueado - Clique no ícone de cadeado/notificação ao lado da barra de endereços para ativar.";
		case "default":
			return "⚠️ Pendente - Clique para permitir notificações do Windows.";
		default:
			return "❓ Status desconhecido.";
	}
}

/**
 * Função para solicitar permissão manualmente
 */
function requestNotificationPermissionManual() {
	if (!("Notification" in window)) {
		alert("Seu navegador não suporta notificações desktop.");
		return;
	}
	
	// Evita múltiplas solicitações simultâneas
	if (notificationPermissionRequested) {
		console.log("Solicitação de permissão já está em andamento");
		return;
	}
	
	if (Notification.permission === "granted") {
		// Envia notificação diretamente para evitar recursão
		try {
			const notification = new Notification("✅ Já Ativado!", {
				body: "As notificações já estão funcionando!",
				tag: 'already-granted',
				icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzIiIGN5PSIzMiIgcj0iMzIiIGZpbGw9IiMxOThlNTYiLz48cGF0aCBkPSJNMjIgMTBMMTMgMTlMOCAxNCIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIzIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48L3N2Zz4='
			});
			notification.onclick = () => { window.focus(); notification.close(); };
			setTimeout(() => notification.close(), 5000);
		} catch (error) {
			console.error('Erro ao enviar notificação:', error);
		}
		return;
	}
	
	notificationPermissionRequested = true;
	Notification.requestPermission().then(function(permission) {
		notificationPermissionRequested = false;
		if (permission === "granted") {
			// Envia notificação diretamente para evitar recursão
			try {
				const notification = new Notification("🎉 Sucesso!", {
					body: "Notificações do Windows ativadas com sucesso!",
					tag: 'permission-success',
					icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzIiIGN5PSIzMiIgcj0iMzIiIGZpbGw9IiMxOThlNTYiLz48cGF0aCBkPSJNMjIgMTBMMTMgMTlMOCAxNCIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIzIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48L3N2Zz4='
				});
				notification.onclick = () => { window.focus(); notification.close(); };
				setTimeout(() => notification.close(), 5000);
			} catch (error) {
				console.error('Erro ao enviar notificação:', error);
			}
		} else {
			alert("Para receber notificações do Windows, você precisa permitir nas configurações do navegador.");
		}
	}).catch(function(error) {
		notificationPermissionRequested = false;
		console.error('Erro ao solicitar permissão:', error);
	});
}