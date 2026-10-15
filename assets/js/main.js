/**
 * Punto de entrada del cliente. Mantiene las acciones del HTML desacopladas
 * de la implementación y evita funciones globales/atributos onclick.
 */
import { initializeApp } from './app.js';
import { toggleChatWidget, selectOption, sendMessage } from './chat.js';

const actions = {
  'toggle-chat': () => toggleChatWidget(),
  'send-chat': () => sendMessage(),
};

document.addEventListener('click', (event) => {
  const target = event.target instanceof Element ? event.target : event.target?.parentElement;
  const control = target?.closest('[data-action], [data-chat-option]');
  if (!control) return;

  if (control.dataset.chatOption) {
    selectOption(control.dataset.chatOption);
    return;
  }

  actions[control.dataset.action]?.();
});

initializeApp();
const year = document.getElementById('current-year');
if (year) year.textContent = String(new Date().getFullYear());
