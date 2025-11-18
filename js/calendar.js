// Variáveis globais do calendário
let currentDate = new Date();
let calendarEvents = {};
let currentFilter = null;

/**
 * Inicializa o calendário
 */
function initializeCalendar() {
	if (authManager && authManager.isAuthenticated()) {
		loadEventsFromServer();
	} else {
		// Modo offline - usar offlineStorage
		loadCalendarEvents();
		renderCalendar();
		renderUpcomingEvents();
	}
}

/**
 * Carrega eventos do servidor
 */
async function loadEventsFromServer() {
	if (!authManager.isAuthenticated()) {
		return;
	}

	try {
		const response = await authManager.authenticatedFetch('/backend/api/events.php');
		const result = await response.json();
		
		if (result.success) {
			// Converter dados do servidor para formato local
			calendarEvents = {};
			result.data.forEach(event => {
				const dateKey = event.event_date;
				if (!calendarEvents[dateKey]) {
					calendarEvents[dateKey] = [];
				}
				calendarEvents[dateKey].push({
					id: event.id,
					time: event.event_time,
					title: event.title,
					description: event.description || ''
				});
			});

			renderCalendar();
			renderUpcomingEvents();
		}
	} catch (error) {
		console.error('Erro ao carregar eventos:', error);
		// Fallback para localStorage
		loadCalendarEvents();
	}
}

/**
 * Carrega eventos do calendário do localStorage (fallback)
 */
function loadCalendarEvents() {
	if (typeof offlineStorage !== 'undefined') {
		calendarEvents = offlineStorage.loadCalendarEvents();
	} else {
		const events = localStorage.getItem('calendarEvents');
		calendarEvents = events ? JSON.parse(events) : {};
	}
}

/**
 * Salva evento no servidor
 */
async function saveEventToServer(title, description, eventDate, eventTime) {
	if (!authManager.isAuthenticated()) {
		alert('Você precisa estar logado para salvar eventos.');
		return false;
	}

	try {
		const response = await authManager.authenticatedFetch('/backend/api/events.php', {
			method: 'POST',
			body: JSON.stringify({
				title: title,
				description: description,
				event_date: eventDate,
				event_time: eventTime
			})
		});

		const result = await response.json();
		
		if (result.success) {
			return result.id;
		} else {
			throw new Error(result.message);
		}
	} catch (error) {
		console.error('Erro ao salvar evento:', error);
		alert('Erro ao salvar evento: ' + error.message);
		return false;
	}
}

/**
 * Remove evento do servidor
 */
async function removeEventFromServer(eventId) {
	if (!authManager.isAuthenticated()) {
		return false;
	}

	try {
		const response = await authManager.authenticatedFetch(`/backend/api/events.php?id=${eventId}`, {
			method: 'DELETE'
		});

		const result = await response.json();
		return result.success;
	} catch (error) {
		console.error('Erro ao remover evento:', error);
		return false;
	}
}

/**
 * Salva eventos do calendário no localStorage (fallback)
 */
function saveCalendarEvents() {
	if (typeof offlineStorage !== 'undefined') {
		offlineStorage.saveCalendarEvents(calendarEvents);
	} else {
		localStorage.setItem('calendarEvents', JSON.stringify(calendarEvents));
	}
}

/**
 * Renderiza o calendário
 */
function renderCalendar() {
	const calendar = document.getElementById('calendar');
	// Corrige ID do elemento conforme HTML (currentMonthYear)
	const monthYear = document.getElementById('currentMonthYear');

	// Verificar se os elementos existem
	if (!calendar || !monthYear) {
		console.error('Elementos do calendário não encontrados');
		return;
	}

	const year = currentDate.getFullYear();
	const month = currentDate.getMonth();

	// Atualiza o cabeçalho do mês/ano
	const monthNames = [
		'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
		'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
	];
	monthYear.textContent = `${monthNames[month]} ${year}`;

	// Limpa o calendário
	calendar.innerHTML = '';

	// Cabeçalho dos dias da semana
	const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
	daysOfWeek.forEach(day => {
		const dayHeader = document.createElement('div');
		dayHeader.className = 'calendar-day-header';
		dayHeader.textContent = day;
		calendar.appendChild(dayHeader);
	});

	// Primeiro dia do mês e último dia do mês anterior
	const firstDay = new Date(year, month, 1);
	const lastDay = new Date(year, month + 1, 0);
	const firstDayOfWeek = firstDay.getDay();
	const daysInMonth = lastDay.getDate();

	// Dias do mês anterior (para preencher o início)
	const prevMonth = new Date(year, month - 1, 0);
	const daysInPrevMonth = prevMonth.getDate();

	for (let i = firstDayOfWeek - 1; i >= 0; i--) {
		const dayElement = document.createElement('div');
		dayElement.className = 'calendar-day other-month';
		dayElement.textContent = daysInPrevMonth - i;
		calendar.appendChild(dayElement);
	}

	// Dias do mês atual
	for (let day = 1; day <= daysInMonth; day++) {
		const dayElement = document.createElement('div');
		dayElement.className = 'calendar-day current-month';
		dayElement.textContent = day;

		const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

		// Marca o dia atual
		const today = new Date();
		if (year === today.getFullYear() && month === today.getMonth() && day === today.getDate()) {
			dayElement.classList.add('today');
		}

		// Verifica se há eventos neste dia
		if (calendarEvents[dateKey] && calendarEvents[dateKey].length > 0) {
			dayElement.classList.add('has-events');

			// Adiciona indicador de eventos
			const eventIndicator = document.createElement('div');
			eventIndicator.className = 'event-indicator';
			eventIndicator.innerHTML = `${calendarEvents[dateKey].length}`;
			dayElement.appendChild(eventIndicator);
		}

		// Adiciona evento de clique
		dayElement.addEventListener('click', () => filterEventsByDate(dateKey, day));

		calendar.appendChild(dayElement);
	}

	// Dias do próximo mês (para preencher o final)
	const totalCells = calendar.children.length - 7; // Subtrai o cabeçalho
	const remainingCells = 42 - totalCells; // 6 semanas * 7 dias

	for (let day = 1; day <= remainingCells; day++) {
		const dayElement = document.createElement('div');
		dayElement.className = 'calendar-day other-month';
		dayElement.textContent = day;
		calendar.appendChild(dayElement);
	}
}

/**
 * Navega para o mês anterior
 */
function previousMonth() {
	currentDate.setMonth(currentDate.getMonth() - 1);
	renderCalendar();
}

/**
 * Navega para o próximo mês
 */
function nextMonth() {
	currentDate.setMonth(currentDate.getMonth() + 1);
	renderCalendar();
}

/**
 * Vai para o mês atual
 */
function goToToday() {
	currentDate = new Date();
	renderCalendar();
}

/**
 * Filtra eventos por data específica
 * @param {string} dateKey - Data no formato YYYY-MM-DD
 * @param {number} day - Dia do mês
 */
function filterEventsByDate(dateKey, day) {
	currentFilter = dateKey;
	renderUpcomingEvents();

	// Atualiza a info do filtro
	const filterInfo = document.getElementById('filterInfo');
	const clearFilterBtn = document.getElementById('clearFilterBtn');
	const [year, month, dayStr] = dateKey.split('-');
	filterInfo.textContent = `Mostrando eventos de ${dayStr}/${month}/${year}`;
	clearFilterBtn.style.display = 'inline-block';
}

/**
 * Limpa o filtro de data
 */
function clearDateFilter() {
	currentFilter = null;
	renderUpcomingEvents();

	// Limpa a info do filtro
	const filterInfo = document.getElementById('filterInfo');
	const clearFilterBtn = document.getElementById('clearFilterBtn');
	filterInfo.textContent = '';
	clearFilterBtn.style.display = 'none';
}

/**
 * Abre o modal para adicionar evento
 * @param {string} preSelectedDate - Data pré-selecionada (opcional)
 */
function openAddEventModal(preSelectedDate = null) {
	const modal = document.getElementById('eventModal');

	// Limpa o formulário
	document.getElementById('eventTime').value = '';
	document.getElementById('eventTitle').value = '';
	document.getElementById('eventDescription').value = '';

	// Define a data (filtro atual, data pré-selecionada ou hoje)
	const dateToSet = preSelectedDate || currentFilter || new Date().toISOString().split('T')[0];
	document.getElementById('eventDate').value = dateToSet;

	// Mostra o modal (Bootstrap 5)
	const bootstrapModal = bootstrap.Modal.getOrCreateInstance(modal);
	bootstrapModal.show();
}

/**
 * Renderiza a lista de eventos futuros
 */
function renderUpcomingEvents() {
	const upcomingEventsList = document.getElementById('upcomingEventsList');
	upcomingEventsList.innerHTML = '';

	const today = new Date();
	const todayKey = today.toISOString().split('T')[0];

	// Coleta todos os eventos futuros
	const futureEvents = [];

	Object.keys(calendarEvents).forEach(dateKey => {
		// Se há filtro, mostra apenas os eventos da data filtrada
		if (currentFilter && dateKey !== currentFilter) {
			return;
		}

		// Se não há filtro, mostra apenas eventos futuros
		if (!currentFilter && dateKey < todayKey) {
			return;
		}

		calendarEvents[dateKey].forEach((event, index) => {
			futureEvents.push({
				dateKey,
				date: new Date(dateKey + 'T00:00:00'),
				event,
				index
			});
		});
	});

	// Ordena por data e depois por horário
	futureEvents.sort((a, b) => {
		if (a.dateKey !== b.dateKey) {
			return a.date - b.date;
		}
		return a.event.time.localeCompare(b.event.time);
	});

	if (futureEvents.length === 0) {
		const emptyMessage = document.createElement('div');
		emptyMessage.className = 'text-center text-muted py-4';
		emptyMessage.innerHTML = `
            <i class="bi bi-calendar-x display-4 mb-2"></i>
            <p>Nenhum evento encontrado.</p>
        `;
		upcomingEventsList.appendChild(emptyMessage);
		return;
	}

	// Renderiza os eventos
	futureEvents.forEach(({ dateKey, date, event, index }) => {
		const eventDiv = document.createElement('div');
		eventDiv.className = 'upcoming-event-item mb-3 p-3 border rounded';

		const formattedDate = date.toLocaleDateString('pt-BR', {
			weekday: 'short',
			day: '2-digit',
			month: '2-digit',
			year: 'numeric'
		});

		eventDiv.innerHTML = `
            <div class="d-flex justify-content-between align-items-start">
                <div class="flex-grow-1">
                    <div class="d-flex align-items-center mb-1">
                        <strong class="me-2">${event.title}</strong>
                        <small class="text-muted">${formattedDate}</small>
                    </div>
                    <div class="d-flex align-items-center mb-2">
                        <i class="bi bi-clock-fill text-primary me-2"></i>
                        <span class="fw-bold">${event.time}</span>
                    </div>
                    ${event.description ? `<p class="text-muted small mb-0">${event.description}</p>` : ''}
                </div>
                <button class="btn btn-sm btn-outline-danger" onclick="removeEventFromList('${dateKey}', ${index})" title="Remover evento">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        `;

		upcomingEventsList.appendChild(eventDiv);
	});
}

/**
 * Adiciona um novo evento
 */
async function addEvent() {
	const dateKey = document.getElementById('eventDate').value;
	const time = document.getElementById('eventTime').value;
	const title = document.getElementById('eventTitle').value;
	const description = document.getElementById('eventDescription').value;

	if (!dateKey || !time || !title) {
		alert('Por favor, preencha a data, horário e o título do evento.');
		return;
	}

	// Se autenticado, salvar no servidor
	if (authManager && authManager.isAuthenticated()) {
		const eventId = await saveEventToServer(title, description, dateKey, time);
		if (eventId) {
			// Inicializa o array de eventos para a data se não existir
			if (!calendarEvents[dateKey]) {
				calendarEvents[dateKey] = [];
			}

			// Adiciona o evento com ID do servidor
			calendarEvents[dateKey].push({
				id: eventId,
				time: time,
				title: title,
				description: description
			});

			// Ordena eventos por horário
			calendarEvents[dateKey].sort((a, b) => a.time.localeCompare(b.time));

			// Atualiza as visualizações
			renderCalendar();
			renderUpcomingEvents();
		}
	} else {
		// Modo offline - usar offlineStorage
		if (typeof offlineStorage !== 'undefined') {
			const newEvent = offlineStorage.addCalendarEvent(title, description, dateKey, time);
			
			if (!calendarEvents[dateKey]) {
				calendarEvents[dateKey] = [];
			}
			
			calendarEvents[dateKey].push({
				id: newEvent.id,
				time: time,
				title: title,
				description: description
			});
		} else {
			// Fallback para localStorage antigo
			if (!calendarEvents[dateKey]) {
				calendarEvents[dateKey] = [];
			}

			calendarEvents[dateKey].push({
				time: time,
				title: title,
				description: description
			});
		}

		calendarEvents[dateKey].sort((a, b) => a.time.localeCompare(b.time));
		saveCalendarEvents();
		renderCalendar();
		renderUpcomingEvents();
	}

	// Fecha o modal
	const modal = bootstrap.Modal.getInstance(document.getElementById('eventModal'));
	if (modal) {
		modal.hide();
	}

	// Limpa o formulário
	document.getElementById('eventDate').value = '';
	document.getElementById('eventTime').value = '';
	document.getElementById('eventTitle').value = '';
	document.getElementById('eventDescription').value = '';
}

/**
 * Remove um evento
 * @param {string} dateKey - Data no formato YYYY-MM-DD
 * @param {number} index - Índice do evento
 */
function removeEvent(dateKey, index) {
	removeEventFromList(dateKey, index);
}

/**
 * Remove um evento da lista
 * @param {string} dateKey - Data no formato YYYY-MM-DD
 * @param {number} index - Índice do evento
 */
async function removeEventFromList(dateKey, index) {
	if (calendarEvents[dateKey]) {
		const event = calendarEvents[dateKey][index];
		
		if (confirm(`Deseja remover o evento "${event.title}"?`)) {
			// Se tem ID e está autenticado, remover do servidor
			if (event.id && authManager && authManager.isAuthenticated()) {
				const success = await removeEventFromServer(event.id);
				if (success) {
					calendarEvents[dateKey].splice(index, 1);

					// Remove a data se não houver mais eventos
					if (calendarEvents[dateKey].length === 0) {
						delete calendarEvents[dateKey];
					}

					// Atualiza as visualizações
					renderCalendar();
					renderUpcomingEvents();
				} else {
					alert('Erro ao remover evento do servidor');
				}
			} else {
				// Modo offline - usar offlineStorage
				if (event.id && typeof offlineStorage !== 'undefined') {
					offlineStorage.removeCalendarEvent(dateKey, event.id);
				}
				
				calendarEvents[dateKey].splice(index, 1);

				if (calendarEvents[dateKey].length === 0) {
					delete calendarEvents[dateKey];
				}

				saveCalendarEvents();
				renderCalendar();
				renderUpcomingEvents();
			}
		}
	}
}

/**
 * Configura notificações para eventos do dia
 */
function setupEventNotifications() {
	const today = new Date();
	const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

	const todayEvents = calendarEvents[todayKey] || [];

	todayEvents.forEach(event => {
		const [hours, minutes] = event.time.split(':');
		const eventTime = new Date();
		eventTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

		// Se o evento ainda não passou hoje
		if (eventTime > new Date()) {
			const timeUntilEvent = eventTime.getTime() - Date.now();

			setTimeout(() => {
				playSound();
				sendNotification("📅 Evento do Calendário", `🕐 ${event.time} - ${event.title}`, {
					requireInteraction: true,
					tag: 'calendar-event',
					icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzIiIGN5PSIzMiIgcj0iMzIiIGZpbGw9IiM2ZjQyYzEiLz4KPHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4PSIxNiIgeT0iMTYiPgo8cmVjdCB4PSI0IiB5PSI2IiB3aWR0aD0iMjQiIGhlaWdodD0iMjAiIHJ4PSIyIiBmaWxsPSJ3aGl0ZSIvPgo8bGluZSB4MT0iMTAiIHkxPSIzIiB4Mj0iMTAiIHkyPSI5IiBzdHJva2U9IiM2ZjQyYzEiIHN0cm9rZS13aWR0aD0iMyIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+CjxsaW5lIHgxPSIyMiIgeTE9IjMiIHgyPSIyMiIgeTI9IjkiIHN0cm9rZT0iIzZmNDJjMSIgc3Ryb2tlLXdpZHRoPSIzIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KPGxpbmUgeDE9IjQiIHkxPSIxMiIgeDI9IjI4IiB5Mj0iMTIiIHN0cm9rZT0iIzZmNDJjMSIgc3Ryb2tlLXdpZHRoPSIyIi8+Cjwvc3ZnPgo8L3N2Zz4=',
					onclick: () => {
						window.focus();
					}
				});
			}, timeUntilEvent);
		}
	});
}

// Fecha modal manualmente (caso necessário)
function closeEventModal() {
	const modalEl = document.getElementById('eventModal');
	const modal = bootstrap.Modal.getInstance(modalEl);
	if (modal) {
		modal.hide();
	}
}

// Inicialização quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
	// Inicializa calendário
	initializeCalendar();

	// Handler de submit do formulário
	const form = document.getElementById('eventForm');
	if (form) {
		form.addEventListener('submit', (e) => {
			e.preventDefault();
			addEvent();
		});
	}
});