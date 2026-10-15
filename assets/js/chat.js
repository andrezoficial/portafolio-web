import { escapeHTML } from "./utilities.js";

    // Chat Widget Functionality
    let chatWidget = null;
    let chatMessages = [];
    let conversationHistory = [];
    let isTyping = false;
    let isSending = false;

    export function toggleChatWidget() {
      chatWidget = document.getElementById('chat-widget');
      const chatIcon = document.getElementById('chat-icon');
      const toggleBtn = document.querySelector('.floating-contact');
      
      if (!chatWidget || !chatIcon || !toggleBtn) return;
      if (chatWidget.classList.contains('active')) {
        chatWidget.classList.remove('active');
        chatWidget.setAttribute('aria-hidden', 'true');
        toggleBtn.setAttribute('aria-expanded', 'false');
        toggleBtn.setAttribute('aria-label', 'Abrir chat de contacto');
        chatIcon.textContent = '💬';
        chatIcon.style.transform = 'rotate(0deg)';
      } else {
        chatWidget.classList.add('active');
        chatWidget.setAttribute('aria-hidden', 'false');
        toggleBtn.setAttribute('aria-expanded', 'true');
        toggleBtn.setAttribute('aria-label', 'Cerrar chat de contacto');
        chatIcon.textContent = '✕';
        chatIcon.style.transform = 'rotate(180deg)';
        
        // Focus input when opening
        setTimeout(() => {
          document.getElementById('chat-input')?.focus();
        }, 300);
      }
    }

    export function selectOption(option) {
      const responses = {
        'proyecto': {
          message: 'Con gusto lo atiendo. ¿Podría describir brevemente el proyecto que tiene en mente?',
          followUp: 'Para una conversación más detallada, puede contactar directamente a Andrés por WhatsApp o correo electrónico.'
        },
        'colaboracion': {
          message: 'Andrés está abierto a colaboraciones profesionales. ¿En qué tipo de proyecto trabaja actualmente?',
          followUp: 'Si lo desea, puede coordinar una videollamada a través de WhatsApp o correo electrónico.'
        },
        'consulta': {
          message: 'Con gusto le ayudo con su consulta técnica. ¿Se relaciona con alguna tecnología o con la arquitectura de una solución?',
          followUp: 'Las áreas de experiencia incluyen JavaScript, React, Node.js, bases de datos y servicios en la nube.'
        },
        'cv': {
          message: 'Puede descargar la hoja de vida actualizada desde el botón "Descargar hoja de vida", en la parte superior de la página.',
          followUp: 'También puede revisar los proyectos destacados en este portafolio.'
        }
      };

      const response = responses[option];
      if (!response) return;
      addBotMessage(response.message);
      
      setTimeout(() => {
        addBotMessage(response.followUp);
      }, 1500);

      // Hide options after selection
      const options = document.querySelector('.chat-options');
      if (options) options.style.display = 'none';
    }

    function addBotMessage(message) {
      const chatBody = document.querySelector('.chat-body');
      if (!chatBody) return;
      
      // Show typing indicator
      showTypingIndicator();
      
      setTimeout(() => {
        hideTypingIndicator();
        
        const messageEl = document.createElement('div');
        messageEl.className = 'chat-message bot-message';
        messageEl.innerHTML = `
          <div class="message-avatar" aria-hidden="true">🤖</div>
          <div class="message-content">
            <p>${escapeHTML(message)}</p>
            <span class="message-time">${getCurrentTime()}</span>
          </div>
        `;
        
        chatBody.appendChild(messageEl);
        chatBody.scrollTop = chatBody.scrollHeight;
      }, 1000);
    }

    function addUserMessage(message) {
      const chatBody = document.querySelector('.chat-body');
      if (!chatBody) return;
      
      const messageEl = document.createElement('div');
      messageEl.className = 'chat-message user-message';
      messageEl.innerHTML = `
        <div class="message-content" style="margin-left: auto;">
          <p style="background: var(--primary-blue); border-radius: 1rem 1rem 0.25rem 1rem; text-align: right;">${message}</p>
          <span class="message-time" style="text-align: right; display: block;">${getCurrentTime()}</span>
        </div>
        <div class="message-avatar" style="background: var(--pure-white); color: var(--primary-blue);" aria-hidden="true">👤</div>
      `;
      
      chatBody.appendChild(messageEl);
      chatBody.scrollTop = chatBody.scrollHeight;
    }

    function showTypingIndicator() {
      if (isTyping) return;
      isTyping = true;
      
      const chatBody = document.querySelector('.chat-body');
      if (!chatBody) return;
      const typingEl = document.createElement('div');
      typingEl.className = 'chat-message bot-message typing-message';
      typingEl.innerHTML = `
        <div class="message-avatar" aria-hidden="true">🤖</div>
        <div class="typing-indicator">
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
        </div>
      `;
      
      chatBody.appendChild(typingEl);
      chatBody.scrollTop = chatBody.scrollHeight;
    }

    function hideTypingIndicator() {
      isTyping = false;
      const typingMessage = document.querySelector('.typing-message');
      if (typingMessage) {
        typingMessage.remove();
      }
    }

  export async function sendMessage() {
  const input = document.getElementById('chat-input');
  if (!input) return;
  const message = input.value.trim();
  
  if (!message || isSending) return;
  isSending = true;
  
  addUserMessage(escapeHTML(message));
  input.value = '';
  
  // Quitar cualquier indicador pendiente de las opciones rápidas y mostrar uno nuevo.
  hideTypingIndicator();
  showTypingIndicator();
  
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history: conversationHistory.slice(-10) }),
      signal: AbortSignal.timeout(25000)
    });
    
    let data = {};
    try { data = await response.json(); } catch { data = {}; }
    hideTypingIndicator();
    
    if (response.ok && data.reply) {
      addBotMessageDirect(data.reply);
      conversationHistory.push({ role: 'user', parts: [{ text: message }] });
      conversationHistory.push({ role: 'model', parts: [{ text: data.reply }] });
    } else {
      addBotMessageDirect(data.error || 'Ocurrió un error. Puede contactar a Andrés por WhatsApp o correo electrónico.');
    }
  } catch (error) {
    hideTypingIndicator();
    addBotMessageDirect('No fue posible conectar con el servidor. Puede contactar a Andrés por WhatsApp o correo electrónico.');
  } finally {
    isSending = false;
    input.focus();
  }
}

function addBotMessageDirect(message) {
  const chatBody = document.querySelector('.chat-body');
  if (!chatBody) return;
  const messageEl = document.createElement('div');
  messageEl.className = 'chat-message bot-message';
  messageEl.innerHTML = `
    <div class="message-avatar" aria-hidden="true">🤖</div>
    <div class="message-content">
      <p>${escapeHTML(message)}</p>
      <span class="message-time">${getCurrentTime()}</span>
    </div>
  `;
  chatBody.appendChild(messageEl);
  chatBody.scrollTop = chatBody.scrollHeight;
}

    function getCurrentTime() {
      const now = new Date();
      return now.toLocaleTimeString('es-ES', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    }

    // Enter key to send message
    export function setupChatInput() {
      const chatInput = document.getElementById('chat-input');
      if (!chatInput) return;
      
      chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.isComposing) {
          e.preventDefault();
          sendMessage();
        }
      });

      // Auto-resize chat body based on content
      const chatBody = document.querySelector('.chat-body');
      if (chatBody && 'ResizeObserver' in window) {
        const resizeObserver = new ResizeObserver(() => {
          chatBody.scrollTop = chatBody.scrollHeight;
        });
        resizeObserver.observe(chatBody);
      }
    }

