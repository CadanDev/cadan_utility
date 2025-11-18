// Configurações da aplicação (localStorage)
(function(){
  function load() {
    if (typeof getAppSettings !== 'function') {
      console.error('utils.js não carregado.');
      return { ttsEnabled: true };
    }
    return getAppSettings();
  }

  function save(settings) {
    if (typeof saveAppSettings === 'function') {
      return saveAppSettings(settings);
    }
    try {
      localStorage.setItem('appSettings', JSON.stringify(settings));
    } catch (e) {}
    return settings;
  }

  document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('settingsForm');
    const ttsCheckbox = document.getElementById('ttsEnabled');
    const testBtn = document.getElementById('testTTS');

    const settings = load();
    ttsCheckbox.checked = !!settings.ttsEnabled;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const newSettings = save({ ttsEnabled: ttsCheckbox.checked });

      // Feedback visual rápido
      const btn = form.querySelector('button[type="submit"]');
      const original = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = '<i class="bi bi-check2-circle"></i> Salvo!';
      setTimeout(() => { btn.disabled = false; btn.innerHTML = original; }, 1200);
    });

    testBtn.addEventListener('click', () => {
      const enabled = ttsCheckbox.checked;
      if (enabled && typeof speak === 'function') {
        speak('Teste de voz. O T T S está habilitado.');
      } else {
        playSoftSound();
      }
    });
  });
})();
