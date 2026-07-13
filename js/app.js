// ============================================================
// MÓDULO: APP — Solo Leveling
// Punto de entrada de la aplicación. Arranca después de que
// data.js, config.js, state.js, utils.js, logic.js, render.js
// y events.js ya están cargados.
// ============================================================

// ============================================================
// BOOT SYSTEM
// ============================================================

function bootSystem() {
  const boot = document.getElementById('bootScreen');

  const _afterBoot = () => {
    if (!ST.onboardingDone) openOnboarding();
    else if (ST.penalty && ST.penalty.pending) openPenaltyScreen();
  };

  if (!boot) { _afterBoot(); return; }

  setTimeout(() => {
    boot.style.opacity    = '0';
    boot.style.transition = 'opacity .8s ease';
    setTimeout(() => { boot.remove(); _afterBoot(); }, 800);
  }, 2500);
}

// Lee lastVisit del storage ANTES de que loadState lo sobreescriba
function _getPrevVisit() {
  try {
    const saved = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEY));
    return saved && saved.lastVisit ? saved.lastVisit : null;
  } catch (e) { return null; }
}

const _prevVisit = _getPrevVisit();
loadState();
checkAndGeneratePenalty(_prevVisit);
if (ST.penalty && ST.penalty.pending) saveState();
renderAll();
bootSystem();

// Detecta cambio de día cuando la app queda en segundo plano
let _currentDay = DateUtils.today();
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState !== 'visible') return;
  const today = DateUtils.today();
  if (today === _currentDay) return;
  const prevDay = _currentDay;
  _currentDay = today;
  if (!ST.penalty?.pending) {
    checkAndGeneratePenalty(prevDay);
    if (ST.penalty?.pending) { saveState(); openPenaltyScreen(); }
  }
  loadState();
  renderAll();
});
