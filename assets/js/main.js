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

// ---- Navegación fija: aparece al bajar y resalta la sección activa ----
const nav = document.querySelector('.site-nav');
if (nav) {
  const links = [...nav.querySelectorAll('a')];
  const sections = links.map((a) => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  const header = document.getElementById('inicio');
  let ticking = false;
  const update = () => {
    ticking = false;
    const y = window.scrollY;
    nav.classList.toggle('is-visible', y > (header ? header.offsetHeight * 0.6 : 300));
    let current = sections[0];
    for (const sec of sections) if (sec.getBoundingClientRect().top <= window.innerHeight * 0.35) current = sec;
    links.forEach((a) => a.classList.toggle('is-active', current && a.getAttribute('href') === '#' + current.id));
  };
  window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  update();
}

// ---- Formulario de contacto sin servidor: abre WhatsApp o el correo con el mensaje listo ----
const form = document.getElementById('contact-form');
if (form) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const nombre = form.nombre.value.trim();
    const mensaje = form.mensaje.value.trim();
    const error = document.getElementById('cf-error');
    if (!nombre || !mensaje) { error.hidden = false; (nombre ? form.mensaje : form.nombre).focus(); return; }
    error.hidden = true;
    const texto = `Hola Andrés, soy ${nombre}. ${mensaje}`;
    const canal = event.submitter?.dataset.channel;
    const url = canal === 'email'
      ? `mailto:andres1997rez@gmail.com?subject=${encodeURIComponent('Contacto desde su portafolio')}&body=${encodeURIComponent(texto)}`
      : `https://wa.me/573226183938?text=${encodeURIComponent(texto)}`;
    if (canal === 'email') window.location.href = url;
    else window.open(url, '_blank', 'noopener');
  });
}
