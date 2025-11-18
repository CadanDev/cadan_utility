// Variáveis para o timer de descanso visual
let timer20min = null;
let timer20sec = null;

/**
 * Inicia o timer de 20 minutos para descanso dos olhos
 */
function start20MinTimer() {
	const startTime = Date.now();
	const timerData = {
		startTime: startTime,
		duration: 20 * 60 * 1000,
		type: '20min'
	};
	if (typeof offlineStorage !== 'undefined') {
		offlineStorage.saveTimerState(timerData);
	} else {
		localStorage.setItem('eyeRestTimer', JSON.stringify(timerData));
	}

	// Atualiza estado dos botões
	updateButtonStates('running');

	const progressBar = document.getElementById('progressBar');
	progressBar.classList.remove('bg-success');
	progressBar.classList.add('bg-primary');
	updateProgressWithTimer(20 * 60 * 1000, progressBar, startTime);

	timer20min = setTimeout(() => {
		if (typeof offlineStorage !== 'undefined') {
			offlineStorage.saveTimerState(null);
		} else {
			localStorage.removeItem('eyeRestTimer');
		}
		playSound();
		sendNotification("👁️ Hora de olhar longe!", "⏰ Olhe para longe por 20 segundos para descansar os olhos.", {
			requireInteraction: true,
			icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzIiIGN5PSIzMiIgcj0iMzIiIGZpbGw9IiMwMDc4ZDQiLz4KPHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4PSIxNiIgeT0iMTYiPgo8cGF0aCBkPSJNMTYgNUM5LjM3MzU3IDUgNCA5LjM3MzU3IDQgMTZDNCAyMi42MjY0IDkuMzczNTcgMjcgMTYgMjdDMjIuNjI2NCAyNyAyNyAyMi42MjY0IDI3IDE2QzI3IDkuMzczNTcgMjIuNjI2NCA1IDE2IDVaIiBmaWxsPSJ3aGl0ZSIvPgo8Y2lyY2xlIGN4PSIxNiIgY3k9IjE2IiByPSI0IiBmaWxsPSIjMDA3OGQ0Ii8+Cjwvc3ZnPgo8L3N2Zz4=',
			tag: 'eye-rest-timer',
			onclick: () => {
				window.focus();
				document.getElementById('start20secBtn').click();
			}
		});
		document.getElementById('start20secBtn').style.display = 'inline-block';
	}, 20 * 60 * 1000);
}

/**
 * Inicia o timer de 20 segundos para olhar longe
 */
function start20SecTimer() {
	const startTime = Date.now();
	const timerData = {
		startTime: startTime,
		duration: 20000,
		type: '20sec'
	};
	if (typeof offlineStorage !== 'undefined') {
		offlineStorage.saveTimerState(timerData);
	} else {
		localStorage.setItem('eyeRestTimer', JSON.stringify(timerData));
	}

	document.getElementById('start20secBtn').style.display = 'none';
	document.getElementById('status').innerHTML = '<i class="bi bi-eye-fill text-success me-2"></i>Olhe longe por 20 segundos!';
	
	// Atualiza estado dos botões
	updateButtonStates('resting');
	
	sendNotification("🔍 Olhe longe!", "👀 Mantenha o olhar distante por 20 segundos para relaxar os olhos.", {
		tag: 'eye-rest-20sec',
		icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzIiIGN5PSIzMiIgcj0iMzIiIGZpbGw9IiMyOGE3NDUiLz4KPHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4PSIxNiIgeT0iMTYiPgo8cGF0aCBkPSJNMTYgNUM5LjM3MzU3IDUgNCA5LjM3MzU3IDQgMTZDNCAyMi42MjY0IDkuMzczNTcgMjcgMTYgMjdDMjIuNjI2NCAyNyAyNyAyMi42MjY0IDI3IDE2QzI3IDkuMzczNTcgMjIuNjI2NCA1IDE2IDVaIiBmaWxsPSJ3aGl0ZSIvPgo8Y2lyY2xlIGN4PSIxNiIgY3k9IjE2IiByPSI0IiBmaWxsPSIjMjhhNzQ1Ii8+Cjwvc3ZnPgo8L3N2Zz4='
	});
	const progressBar = document.getElementById('progressBar');
	progressBar.classList.remove('bg-primary');
	progressBar.classList.add('bg-success');
	updateProgressWithTimer(20000, progressBar, startTime);

	timer20sec = setTimeout(() => {
		localStorage.removeItem('eyeRestTimer');
		playSound();
		sendNotification("✅ Pode voltar!", "💻 Você pode voltar ao trabalho. Próximo lembrete em 20 minutos.", {
			tag: 'eye-rest-complete',
			icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzIiIGN5PSIzMiIgcj0iMzIiIGZpbGw9IiMxOThlNTYiLz4KPHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4PSIxNiIgeT0iMTYiPgo8cGF0aCBkPSJNMjIgMTBMMTMgMTlMOCAxNCIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIzIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+Cjwvc3ZnPg=='
		});
		document.getElementById('status').innerHTML = '';
		start20MinTimer();
	}, 20000);
}

/**
 * Inicia automaticamente o timer de descanso de olhos
 */
function startEyeRestTimer() {
	restoreTimerState();
}

/**
 * Pausa o timer atual
 */
function pauseTimer() {
	if (timer20min) {
		clearTimeout(timer20min);
		timer20min = null;
	}
	if (timer20sec) {
		clearTimeout(timer20sec);
		timer20sec = null;
	}
	if (progressInterval) {
		clearInterval(progressInterval);
		progressInterval = null;
	}
	localStorage.removeItem('eyeRestTimer');
	document.getElementById('status').innerHTML = '<i class="bi bi-pause-circle text-warning me-2"></i>Timer pausado';
	
	// Atualiza estado visual dos botões
	updateButtonStates('paused');
}

/**
 * Para o timer completamente
 */
function stopTimer() {
	pauseTimer();
	const progressBar = document.getElementById('progressBar');
	const progressCircle = document.getElementById('progressCircle');
	const progressRing = document.querySelector('.progress-ring');
	
	if (progressBar) {
		progressBar.style.width = '0%';
		progressBar.textContent = '';
	}
	if (progressCircle) {
		progressCircle.style.strokeDashoffset = 565.48; // Reseta o círculo
	}
	if (progressRing) {
		progressRing.classList.remove('rest-mode');
	}
	
	const timerText = document.getElementById('timerText');
	if (timerText) {
		timerText.textContent = '20:00';
	}
	document.getElementById('status').innerHTML = '';
	updateButtonStates('stopped');
}

/**
 * Restaura o estado do timer a partir do localStorage
 */
function restoreTimerState() {
	let timerData;
	if (typeof offlineStorage !== 'undefined') {
		timerData = offlineStorage.loadTimerState();
	} else {
		const data = localStorage.getItem('eyeRestTimer');
		timerData = data ? JSON.parse(data) : null;
	}
	if (!timerData) {
		// Se não há timer salvo, inicia automaticamente
		start20MinTimer();
		return;
	}

	const timer = typeof timerData === 'string' ? JSON.parse(timerData) : timerData;
	const now = Date.now();
	const elapsed = now - timer.startTime;
	const remaining = timer.duration - elapsed;

	if (remaining <= 0) {
		// Timer já deveria ter terminado
		if (typeof offlineStorage !== 'undefined') {
			offlineStorage.saveTimerState(null);
		} else {
			localStorage.removeItem('eyeRestTimer');
		}
		if (timer.type === '20min') {
			// Deveria mostrar o botão de 20 segundos
			document.getElementById('start20secBtn').style.display = 'inline-block';
			playSound();
			sendNotification("👁️ Hora de olhar longe!", "⏰ Olhe para longe por 20 segundos para descansar os olhos.", {
				requireInteraction: true,
				tag: 'eye-rest-timer-restore',
				icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzIiIGN5PSIzMiIgcj0iMzIiIGZpbGw9IiMwMDc4ZDQiLz4KPHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4PSIxNiIgeT0iMTYiPgo8cGF0aCBkPSJNMTYgNUM5LjM3MzU3IDUgNCA5LjM3MzU3IDQgMTZDNCAyMi42MjY0IDkuMzczNTcgMjcgMTYgMjdDMjIuNjI2NCAyNyAyNyAyMi42MjY0IDI3IDE2QzI3IDkuMzczNTcgMjIuNjI2NCA1IDE2IDVaIiBmaWxsPSJ3aGl0ZSIvPgo8Y2lyY2xlIGN4PSIxNiIgY3k9IjE2IiByPSI0IiBmaWxsPSIjMDA3OGQ0Ii8+Cjwvc3ZnPgo8L3N2Zz4=',
				onclick: () => {
					window.focus();
					document.getElementById('start20secBtn').click();
				}
			});
		} else {
			// Timer de 20 segundos terminou, inicia novo ciclo
			start20MinTimer();
		}
	} else {
		// Timer ainda está rodando, restaura o estado
		const progressBar = document.getElementById('progressBar');

		if (timer.type === '20min') {
			progressBar.classList.remove('bg-success');
			progressBar.classList.add('bg-primary');
			updateProgressWithTimer(timer.duration, progressBar, timer.startTime);

			timer20min = setTimeout(() => {
				if (typeof offlineStorage !== 'undefined') {
					offlineStorage.saveTimerState(null);
				} else {
					localStorage.removeItem('eyeRestTimer');
				}
				playSound();
				sendNotification("👁️ Hora de olhar longe!", "⏰ Olhe para longe por 20 segundos para descansar os olhos.", {
					requireInteraction: true,
					tag: 'eye-rest-timer-continued',
					icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzIiIGN5PSIzMiIgcj0iMzIiIGZpbGw9IiMwMDc4ZDQiLz4KPHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4PSIxNiIgeT0iMTYiPgo8cGF0aCBkPSJNMTYgNUM5LjM3MzU3IDUgNCA5LjM3MzU3IDQgMTZDNCAyMi42MjY0IDkuMzczNTcgMjcgMTYgMjdDMjIuNjI2NCAyNyAyNyAyMi42MjY0IDI3IDE2QzI3IDkuMzczNTcgMjIuNjI2NCA1IDE2IDVaIiBmaWxsPSJ3aGl0ZSIvPgo8Y2lyY2xlIGN4PSIxNiIgY3k9IjE2IiByPSI0IiBmaWxsPSIjMDA3OGQ0Ii8+Cjwvc3ZnPgo8L3N2Zz4=',
					onclick: () => {
						window.focus();
						document.getElementById('start20secBtn').click();
					}
				});
				document.getElementById('start20secBtn').style.display = 'inline-block';
			}, remaining);
		} else {
			// Timer de 20 segundos
			document.getElementById('start20secBtn').style.display = 'none';
			document.getElementById('status').innerHTML = '<i class="bi bi-eye-fill text-success me-2"></i>Olhe longe por 20 segundos!';
			progressBar.classList.remove('bg-primary');
			progressBar.classList.add('bg-success');
			updateProgressWithTimer(timer.duration, progressBar, timer.startTime);

			timer20sec = setTimeout(() => {
				if (typeof offlineStorage !== 'undefined') {
					offlineStorage.saveTimerState(null);
				} else {
					localStorage.removeItem('eyeRestTimer');
				}
				playSound();
				sendNotification("✅ Pode voltar!", "💻 Você pode voltar ao trabalho. Próximo lembrete em 20 minutos.", {
					tag: 'eye-rest-complete-continued',
					icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzIiIGN5PSIzMiIgcj0iMzIiIGZpbGw9IiMxOThlNTYiLz4KPHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4PSIxNiIgeT0iMTYiPgo8cGF0aCBkPSJNMjIgMTBMMTMgMTlMOCAxNCIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIzIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+Cjwvc3ZnPg=='
				});
				document.getElementById('status').innerHTML = '';
				start20MinTimer();
			}, remaining);
		}
	}
}

/**
 * Atualiza a barra de progresso com contador de tempo
 * @param {number} duration - Duração total em milissegundos
 * @param {HTMLElement} progressBar - Elemento da barra de progresso
 * @param {number} startTime - Tempo de início
 */
function updateProgressWithTimer(duration, progressBar, startTime) {
	// Limpa intervalo anterior se existir
	if (typeof progressInterval !== 'undefined' && progressInterval) {
		clearInterval(progressInterval);
	}
	
	const timerText = document.getElementById('timerText');
	const progressCircle = document.getElementById('progressCircle');
	const progressRing = document.querySelector('.progress-ring');
	const circumference = 2 * Math.PI * 90; // raio = 90
	
	function updateDisplay() {
		const elapsed = Date.now() - startTime;
		const remaining = Math.max(0, duration - elapsed);
		const percent = Math.min((elapsed / duration) * 100, 100);
		
		// Atualiza barra de progresso horizontal
		progressBar.style.width = percent + "%";
		
		// Atualiza anel de progresso circular
		if (progressCircle) {
			const offset = circumference - (percent / 100) * circumference;
			progressCircle.style.strokeDashoffset = offset;
		}
		
		// Adiciona classe para modo de descanso (20 segundos)
		if (progressRing) {
			if (duration === 20000) {
				progressRing.classList.add('rest-mode');
			} else {
				progressRing.classList.remove('rest-mode');
			}
		}
		
		// Atualiza texto do timer
		const minutes = Math.floor(remaining / 60000);
		const seconds = Math.floor((remaining % 60000) / 1000);
		if (timerText) {
			timerText.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
		}
		
		if (percent >= 100) {
			clearInterval(progressInterval);
		}
	}
	
	// Atualiza imediatamente
	updateDisplay();
	
	// Atualiza a cada segundo
	progressInterval = setInterval(updateDisplay, 1000);
}

/**
 * Atualiza o estado visual dos botões
 * @param {string} state - Estado atual: 'running', 'paused', 'stopped', 'resting'
 */
function updateButtonStates(state) {
	const pauseBtn = document.getElementById('pauseBtn');
	const stopBtn = document.getElementById('stopBtn');
	const start20secBtn = document.getElementById('start20secBtn');
	
	// Remove todas as classes de estado
	pauseBtn.classList.remove('btn-warning', 'btn-secondary', 'btn-outline-warning');
	stopBtn.classList.remove('btn-danger', 'btn-outline-danger');
	
	switch(state) {
		case 'running':
			pauseBtn.classList.add('btn-warning');
			pauseBtn.innerHTML = '<i class="bi bi-pause-circle"></i> Pausar';
			pauseBtn.disabled = false;
			stopBtn.classList.add('btn-danger');
			stopBtn.disabled = false;
			start20secBtn.style.display = 'none';
			break;
			
		case 'paused':
			pauseBtn.classList.add('btn-secondary');
			pauseBtn.innerHTML = '<i class="bi bi-pause-circle-fill"></i> Pausado';
			pauseBtn.disabled = true;
			stopBtn.classList.add('btn-outline-danger');
			stopBtn.innerHTML = '<i class="bi bi-arrow-clockwise"></i> Reiniciar';
			stopBtn.disabled = false;
			break;
			
		case 'stopped':
			pauseBtn.classList.add('btn-outline-warning');
			pauseBtn.disabled = true;
			stopBtn.classList.add('btn-outline-danger');
			stopBtn.disabled = true;
			break;
			
		case 'resting':
			pauseBtn.classList.add('btn-warning');
			pauseBtn.innerHTML = '<i class="bi bi-pause-circle"></i> Pausar';
			pauseBtn.disabled = false;
			stopBtn.classList.add('btn-danger');
			stopBtn.disabled = false;
			start20secBtn.style.display = 'none';
			break;
	}
}