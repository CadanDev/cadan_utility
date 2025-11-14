/**
 * Gerenciador de Armazenamento Offline
 * Gerencia dados no localStorage quando o usuário não está logado
 */

class OfflineStorage {
    constructor() {
        this.storagePrefix = 'lembretes_';
    }

    /**
     * Salva dados no localStorage
     * @param {string} key - Chave de armazenamento
     * @param {any} data - Dados a serem salvos
     */
    save(key, data) {
        try {
            const fullKey = this.storagePrefix + key;
            localStorage.setItem(fullKey, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Erro ao salvar no localStorage:', error);
            return false;
        }
    }

    /**
     * Carrega dados do localStorage
     * @param {string} key - Chave de armazenamento
     * @param {any} defaultValue - Valor padrão se não existir
     */
    load(key, defaultValue = null) {
        try {
            const fullKey = this.storagePrefix + key;
            const data = localStorage.getItem(fullKey);
            return data ? JSON.parse(data) : defaultValue;
        } catch (error) {
            console.error('Erro ao carregar do localStorage:', error);
            return defaultValue;
        }
    }

    /**
     * Remove dados do localStorage
     * @param {string} key - Chave de armazenamento
     */
    remove(key) {
        try {
            const fullKey = this.storagePrefix + key;
            localStorage.removeItem(fullKey);
            return true;
        } catch (error) {
            console.error('Erro ao remover do localStorage:', error);
            return false;
        }
    }

    /**
     * Limpa todos os dados offline
     */
    clearAll() {
        try {
            const keys = Object.keys(localStorage);
            keys.forEach(key => {
                if (key.startsWith(this.storagePrefix)) {
                    localStorage.removeItem(key);
                }
            });
            return true;
        } catch (error) {
            console.error('Erro ao limpar localStorage:', error);
            return false;
        }
    }

    // ========== LEMBRETES DE MEDICAMENTOS ==========

    /**
     * Salva lembretes de medicamentos offline
     */
    saveMedicineReminders(reminders) {
        return this.save('medicine_reminders', reminders);
    }

    /**
     * Carrega lembretes de medicamentos offline
     */
    loadMedicineReminders() {
        return this.load('medicine_reminders', []);
    }

    /**
     * Adiciona um lembrete de medicamento
     */
    addMedicineReminder(time, medicineName, instructions = '') {
        const reminders = this.loadMedicineReminders();
        const newReminder = {
            id: 'offline_' + Date.now(),
            time: time,
            medicine_name: medicineName,
            instructions: instructions,
            created_at: new Date().toISOString()
        };
        reminders.push(newReminder);
        this.saveMedicineReminders(reminders);
        return newReminder;
    }

    /**
     * Remove um lembrete de medicamento
     */
    removeMedicineReminder(id) {
        const reminders = this.loadMedicineReminders();
        const filtered = reminders.filter(r => r.id !== id);
        return this.saveMedicineReminders(filtered);
    }

    // ========== EVENTOS DO CALENDÁRIO ==========

    /**
     * Salva eventos do calendário offline
     */
    saveCalendarEvents(events) {
        return this.save('calendar_events', events);
    }

    /**
     * Carrega eventos do calendário offline
     */
    loadCalendarEvents() {
        return this.load('calendar_events', {});
    }

    /**
     * Adiciona um evento ao calendário
     */
    addCalendarEvent(title, description, eventDate, eventTime) {
        const events = this.loadCalendarEvents();
        const newEvent = {
            id: 'offline_' + Date.now(),
            title: title,
            description: description,
            event_date: eventDate,
            event_time: eventTime,
            created_at: new Date().toISOString()
        };
        
        if (!events[eventDate]) {
            events[eventDate] = [];
        }
        events[eventDate].push(newEvent);
        this.saveCalendarEvents(events);
        return newEvent;
    }

    /**
     * Remove um evento do calendário
     */
    removeCalendarEvent(eventDate, eventId) {
        const events = this.loadCalendarEvents();
        if (events[eventDate]) {
            events[eventDate] = events[eventDate].filter(e => e.id !== eventId);
            if (events[eventDate].length === 0) {
                delete events[eventDate];
            }
            return this.saveCalendarEvents(events);
        }
        return false;
    }

    /**
     * Atualiza um evento do calendário
     */
    updateCalendarEvent(eventDate, eventId, updatedData) {
        const events = this.loadCalendarEvents();
        if (events[eventDate]) {
            const eventIndex = events[eventDate].findIndex(e => e.id === eventId);
            if (eventIndex !== -1) {
                events[eventDate][eventIndex] = {
                    ...events[eventDate][eventIndex],
                    ...updatedData
                };
                return this.saveCalendarEvents(events);
            }
        }
        return false;
    }

    // ========== ESTADO DO TIMER DE DESCANSO ==========

    /**
     * Salva estado do timer de descanso visual
     */
    saveTimerState(state) {
        return this.save('eye_rest_timer', state);
    }

    /**
     * Carrega estado do timer de descanso visual
     */
    loadTimerState() {
        return this.load('eye_rest_timer', null);
    }

    // ========== SINCRONIZAÇÃO ==========

    /**
     * Prepara dados para sincronização com o servidor
     * Retorna todos os dados offline para envio ao fazer login
     */
    getDataForSync() {
        return {
            medicineReminders: this.loadMedicineReminders(),
            calendarEvents: this.loadCalendarEvents(),
            timestamp: new Date().toISOString()
        };
    }

    /**
     * Marca dados como sincronizados
     * Move dados offline para um backup antes de limpar
     */
    markAsSynced() {
        const backup = this.getDataForSync();
        this.save('last_sync_backup', backup);
        return true;
    }

    /**
     * Verifica se há dados offline não sincronizados
     */
    hasUnsyncedData() {
        const medicines = this.loadMedicineReminders();
        const events = this.loadCalendarEvents();
        return medicines.length > 0 || Object.keys(events).length > 0;
    }
}

// Criar instância global
const offlineStorage = new OfflineStorage();
