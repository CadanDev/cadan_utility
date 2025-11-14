/**
 * notes.js - Gerenciamento de Notas Temporárias com Rich Text Editor
 */

let notesQuill;
let notesSaveTimeout;

/**
 * Inicializa o editor de notas Quill
 */
function initNotesEditor() {
	const toolbarOptions = [
		['bold', 'italic', 'underline', 'strike'],        // toggled buttons
		['blockquote', 'code-block'],

		[{ 'header': 1 }, { 'header': 2 }],               // custom button values
		[{ 'list': 'ordered'}, { 'list': 'bullet' }],
		[{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
		[{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent

		[{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
		[{ 'header': [1, 2, 3, 4, 5, 6, false] }],

		[{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
		[{ 'align': [] }],

		['clean']                                         // remove formatting button
	];

	notesQuill = new Quill('#notesEditor', {
		theme: 'snow',
		modules: {
			toolbar: toolbarOptions
		},
		placeholder: 'Digite suas anotações aqui...'
	});

	// Carregar notas salvas
	loadNotes();

	// Auto-save ao digitar
	notesQuill.on('text-change', function(delta, oldDelta, source) {
		if (source === 'user') {
			clearTimeout(notesSaveTimeout);
			notesSaveTimeout = setTimeout(() => {
				saveNotes();
			}, 1000); // Salva 1 segundo após parar de digitar
		}
	});
}

/**
 * Salva o conteúdo das notas no localStorage
 */
function saveNotes() {
	try {
		const notesContent = notesQuill.root.innerHTML;
		localStorage.setItem('temporaryNotes', notesContent);
		
		// Mostrar indicador de salvamento
		const indicator = document.getElementById('notesSavedIndicator');
		if (indicator) {
			indicator.innerHTML = '<i class="bi bi-check-circle text-success"></i> Salvo automaticamente';
			indicator.classList.remove('text-muted');
			indicator.classList.add('text-success');
			
			setTimeout(() => {
				indicator.classList.remove('text-success');
				indicator.classList.add('text-muted');
			}, 2000);
		}
	} catch (error) {
		console.error('Erro ao salvar notas:', error);
	}
}

/**
 * Carrega o conteúdo das notas do localStorage
 */
function loadNotes() {
	try {
		const savedNotes = localStorage.getItem('temporaryNotes');
		if (savedNotes && notesQuill) {
			notesQuill.root.innerHTML = savedNotes;
		}
	} catch (error) {
		console.error('Erro ao carregar notas:', error);
	}
}

/**
 * Limpa todas as notas
 */
function clearNotes() {
	if (confirm('Tem certeza que deseja limpar todas as notas? Esta ação não pode ser desfeita.')) {
		if (notesQuill) {
			notesQuill.setText('');
			localStorage.removeItem('temporaryNotes');
			
			const indicator = document.getElementById('notesSavedIndicator');
			if (indicator) {
				indicator.innerHTML = '<i class="bi bi-check-circle text-success"></i> Notas limpas';
				indicator.classList.remove('text-muted');
				indicator.classList.add('text-success');
				
				setTimeout(() => {
					indicator.innerHTML = '<i class="bi bi-check-circle text-success"></i> Salvo automaticamente';
					indicator.classList.remove('text-success');
					indicator.classList.add('text-muted');
				}, 2000);
			}
		}
	}
}
