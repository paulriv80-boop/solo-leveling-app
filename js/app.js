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

  if (!boot) return;

  setTimeout(() => {

    boot.style.opacity = '0';
    boot.style.transition = 'opacity .8s ease';

    setTimeout(() => {
      boot.remove();
    }, 800);

  }, 2500);

}

loadState();
renderAll();
bootSystem();
