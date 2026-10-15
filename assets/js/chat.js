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
          message: '¡Perfecto! 🚀 Me encanta trabajar en nuevos proyectos. ¿Podrías contarme más detalles sobre lo que tienes en mente?',
          followUp: 'Te recomiendo que me contactes por WhatsApp para una conversación más detallada.'
        },
        'colaboracion': {
          message: '¡Excelente! 🤝 Siempre estoy abierto a colaboraciones interesantes. ¿En qué tipo de proyecto estás trabajando?',
          followUp: 'Podemos coordinar una videollamada para conocernos mejor.'
        },
        'consulta': {
          message: '💡 Con gusto te ayudo con tu consulta técnica. ¿Es sobre alguna tecnología específica o arquitectura de software?',
          followUp: 'Puedo asesorarte en JavaScript, React, Node.js, bases de datos y más.'
        },
        'cv': {
          message: '📄 ¡Por supuesto! Puedes descargar mi CV actualizado desde el botón en el header.',
          followUp: 'También puedes revisar mis proyectos destacados aquí en el portafolio.'
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
      addBotMessageDirect(data.error || 'Ocurrió un error. Intenta contactarme por WhatsApp 📱');
    }
  } catch (error) {
    hideTypingIndicator();
    addBotMessageDirect('No pude conectar con el servidor. Intenta contactarme por WhatsApp 📱');
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

