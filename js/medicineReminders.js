// Variáveis para os lembretes de medicamentos
let medicineTimers = {};

/**
 * Salva os lembretes de medicamentos no servidor
 */
async function saveMedicineReminderToServer(time, medicineName, instructions = '') {
	if (!authManager.isAuthenticated()) {
		alert('Você precisa estar logado para salvar lembretes.');
		return false;
	}

	try {
		const response = await authManager.authenticatedFetch('/backend/api/medicines.php', {
			method: 'POST',
			body: JSON.stringify({
				time: time,
				medicine_name: medicineName,
				instructions: instructions
			})
		});

		const result = await response.json();
		
		if (result.success) {
			return result.id;
		} else {
			throw new Error(result.message);
		}
	} catch (error) {
		console.error('Erro ao salvar lembrete:', error);
		alert('Erro ao salvar lembrete: ' + error.message);
		return false;
	}
}

/**
 * Salva os lembretes de medicamentos no localStorage (fallback)
 */
function saveMedicineReminders() {
	const reminders = [];
	const remindersList = document.getElementById('medicineList');
	remindersList.querySelectorAll('.reminder-item').forEach(item => {
		const time = item.querySelector('.reminder-time').textContent;
		const text = item.querySelector('.reminder-text').textContent;
		const id = item.getAttribute('data-id');
		reminders.push({ 
			id: id || 'local_' + Date.now(), 
			time, 
			medicine_name: text,
			instructions: ''
		});
	});
	
	if (typeof offlineStorage !== 'undefined') {
		offlineStorage.saveMedicineReminders(reminders);
	} else {
		localStorage.setItem('medicineReminders', JSON.stringify(reminders));
	}
}

/**
 * Carrega os lembretes de medicamentos do servidor
 */
async function loadMedicineRemindersFromServer() {
	if (!authManager.isAuthenticated()) {
		return;
	}

	try {
		const response = await authManager.authenticatedFetch('/backend/api/medicines.php');
		const result = await response.json();
		
		if (result.success) {
			const remindersList = document.getElementById('medicineList');
			remindersList.innerHTML = '';

			result.data.forEach(reminder => {
				const displayText = reminder.instructions ? 
					`${reminder.medicine_name} - ${reminder.instructions}` : 
					reminder.medicine_name;
				addReminderToList(reminder.time, displayText, reminder.id);
			});

			setupAllMedicineTimers();
		}
	} catch (error) {
		console.error('Erro ao carregar lembretes:', error);
		// Fallback para localStorage
		loadMedicineReminders();
	}
}

/**
 * Carrega os lembretes de medicamentos do localStorage (fallback)
 */
function loadMedicineReminders() {
	let reminders;
	
	if (typeof offlineStorage !== 'undefined') {
		reminders = offlineStorage.loadMedicineReminders();
	} else {
		reminders = JSON.parse(localStorage.getItem('medicineReminders') || '[]');
	}
	
	const remindersList = document.getElementById('medicineList');
	remindersList.innerHTML = '';

	reminders.forEach(reminder => {
		const displayText = reminder.instructions ? 
			`${reminder.medicine_name} - ${reminder.instructions}` : 
			reminder.medicine_name;
		addReminderToList(reminder.time, displayText, reminder.id);
	});

	setupAllMedicineTimers();
}

/**
 * Adiciona um novo lembrete de medicamento
 */
async function addMedicineReminder() {
	const timeInput = document.getElementById('medicineTime');
	const textInput = document.getElementById('medicineText');

	if (!timeInput.value || !textInput.value) {
		alert('Por favor, preencha o horário e o texto do lembrete.');
		return;
	}

	// Se autenticado, salvar no servidor
	if (authManager && authManager.isAuthenticated()) {
		const reminderId = await saveMedicineReminderToServer(timeInput.value, textInput.value);
		if (reminderId) {
			addReminderToList(timeInput.value, textInput.value, reminderId);
			setupAllMedicineTimers();
		}
	} else {
		// Modo offline - usar offlineStorage
		if (typeof offlineStorage !== 'undefined') {
			const reminder = offlineStorage.addMedicineReminder(timeInput.value, textInput.value);
			addReminderToList(timeInput.value, textInput.value, reminder.id);
		} else {
			addReminderToList(timeInput.value, textInput.value);
			saveMedicineReminders();
		}
		setupAllMedicineTimers();
	}

	timeInput.value = '';
	textInput.value = '';
}

/**
 * Adiciona um lembrete à lista visual
 * @param {string} time - Horário do lembrete
 * @param {string} text - Texto do lembrete
 * @param {number} id - ID do lembrete no servidor (opcional)
 */
function addReminderToList(time, text, id = null) {
	const remindersList = document.getElementById('medicineList');
	const reminderDiv = document.createElement('div');
	reminderDiv.className = 'reminder-item d-flex justify-content-between align-items-center mb-2 p-2 bg-light rounded';
	if (id) {
		reminderDiv.setAttribute('data-id', id);
	}
	reminderDiv.innerHTML = `
        <div>
            <i class="bi bi-clock-fill text-primary me-2"></i>
            <strong class="reminder-time">${time}</strong> - 
            <i class="bi bi-capsule text-success me-1"></i>
            <span class="reminder-text">${text}</span>
        </div>
        <button class="btn btn-sm btn-danger" onclick="removeReminder(this)">
            <i class="bi bi-trash"></i>
        </button>
    `;
	remindersList.appendChild(reminderDiv);
}

/**
 * Remove um lembrete do servidor
 */
async function removeMedicineReminderFromServer(id) {
	if (!authManager.isAuthenticated()) {
		return false;
	}

	try {
		const response = await authManager.authenticatedFetch(`/backend/api/medicines.php?id=${id}`, {
			method: 'DELETE'
		});

		const result = await response.json();
		return result.success;
	} catch (error) {
		console.error('Erro ao remover lembrete:', error);
		return false;
	}
}

/**
 * Remove um lembrete da lista
 * @param {HTMLElement} button - Botão de remoção clicado
 */
async function removeReminder(button) {
	const reminderItem = button.closest('.reminder-item');
	const reminderId = reminderItem.getAttribute('data-id');

	// Se tem ID e está autenticado, remover do servidor
	if (reminderId && authManager && authManager.isAuthenticated()) {
		const success = await removeMedicineReminderFromServer(reminderId);
		if (success) {
			reminderItem.remove();
			setupAllMedicineTimers();
		} else {
			alert('Erro ao remover lembrete do servidor');
		}
	} else {
		// Modo offline
		if (reminderId && typeof offlineStorage !== 'undefined') {
			offlineStorage.removeMedicineReminder(reminderId);
		}
		reminderItem.remove();
		saveMedicineReminders();
		setupAllMedicineTimers();
	}
}

/**
 * Configura todos os timers de medicamentos
 */
function setupAllMedicineTimers() {
	// Limpa timers existentes
	Object.values(medicineTimers).forEach(timerId => clearTimeout(timerId));
	medicineTimers = {};

	const reminders = JSON.parse(localStorage.getItem('medicineReminders') || '[]');

	reminders.forEach(reminder => {
		setupMedicineTimer(reminder.time, reminder.text);
	});
}

/**
 * Configura um timer individual para medicamento
 * @param {string} time - Horário no formato HH:MM
 * @param {string} text - Texto do lembrete
 */
function setupMedicineTimer(time, text) {
	const now = new Date();
	const [hours, minutes] = time.split(':');
	const targetTime = new Date();
	targetTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

	// Se o horário já passou hoje, agenda para amanhã
	if (targetTime <= now) {
		targetTime.setDate(targetTime.getDate() + 1);
	}

	const timeUntilReminder = targetTime.getTime() - now.getTime();

	const timerId = setTimeout(() => {
		// Usa o novo sistema de alerta com som contínuo
		showMedicineAlert(text);
		sendNotification("💊 Lembrete de Remédio", `⏰ ${time} - ${text}`, {
			requireInteraction: true,
			icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzIiIGN5PSIzMiIgcj0iMzIiIGZpbGw9IiMyOGE3NDUiLz4KPHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4PSIxNiIgeT0iMTYiPgo8cGF0aCBkPSJNMTYgNEM5LjM3MjU4IDQgNCA5LjM3MjU4IDQgMTZDNCAyMi42Mjc0IDkuMzcyNTggMjggMTYgMjhDMjIuNjI3NCAyOCAyOCAyMi42Mjc0IDI4IDE2QzI4IDkuMzcyNTggMjIuNjI3NCA0IDE2IDRaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4KPC9zdmc+',
			tag: 'medicine-reminder',
			onclick: () => {
				window.focus();
				showMedicineAlert(text);
			}
		});

		// Reagenda para o próximo dia
		setupMedicineTimer(time, text);
	}, timeUntilReminder);

	medicineTimers[`${time}-${text}`] = timerId;
}