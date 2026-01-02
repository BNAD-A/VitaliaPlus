// =========================
// CHAT WIDGET - Vitalia+
// =========================

const GROQ_API_KEY = 'REPLACE_ME';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

let conversationHistoryWidget = [];
let isFirstMessageWidget = true;

function toggleChatWidget() {
  const popup = document.getElementById('chatPopupWidget');
  const btn = document.getElementById('chatWidgetBtn');

  popup.classList.toggle('active');
  btn.classList.toggle('active');

  popup.setAttribute('aria-hidden', popup.classList.contains('active') ? 'false' : 'true');

  if (popup.classList.contains('active')) {
    document.getElementById('chatInputWidget').focus();
  }
}

async function sendMessageWidget() {
  const input = document.getElementById('chatInputWidget');
  const sendBtn = document.getElementById('sendBtnWidget');
  const message = input.value.trim();

  if (!message) return;

  input.disabled = true;
  sendBtn.disabled = true;

  if (isFirstMessageWidget) {
    const qs = document.getElementById('quickSuggestionsWidget');
    if (qs) qs.style.display = 'none';
    isFirstMessageWidget = false;
  }

  addMessageWidget(message, 'user');
  input.value = '';
  showTypingWidget();

  conversationHistoryWidget.push({ role: 'user', content: message });

  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: `Tu es un assistant santé pour Vitalia+.

RÈGLES :
- Réponses CONCISES (max 150 mots)
- Direct et précis
- Listes à puces
- Pratique et actionnable
- Pas de long discours

DOMAINES : nutrition, exercice, sommeil, stress, hygiène de vie

IMPORTANT :
- si urgence médicale : recommande d'appeler les urgences/consulter un médecin.`
          },
          ...conversationHistoryWidget
        ],
        temperature: 0.5,
        max_tokens: 300
      })
    });

    if (!response.ok) throw new Error('Erreur API');

    const data = await response.json();
    const assistantMessage = data?.choices?.[0]?.message?.content || "Je n'ai pas compris, peux-tu reformuler ?";

    conversationHistoryWidget.push({ role: 'assistant', content: assistantMessage });

    hideTypingWidget();
    addMessageWidget(assistantMessage, 'assistant');

  } catch (error) {
    console.error('Erreur:', error);
    hideTypingWidget();
    addMessageWidget("Désolé, une erreur est survenue. Vérifie ta clé GROQ et réessaie.", 'assistant');
  }

  input.disabled = false;
  sendBtn.disabled = false;
  input.focus();
}

function addMessageWidget(text, sender) {
  const container = document.getElementById('chatMessagesWidget');
  const typingRow = document.getElementById('typingIndicatorWidget')?.parentElement;

  const messageDiv = document.createElement('div');
  messageDiv.className = `chat-message-widget ${sender}`;

  const avatar = document.createElement('div');
  avatar.className = 'chat-message-avatar';
  avatar.textContent = sender === 'user' ? '👤' : '🩺';

  const content = document.createElement('div');
  content.className = 'chat-message-content';
  content.innerHTML = escapeHtml(text).replace(/\n/g, '<br>');

  messageDiv.appendChild(avatar);
  messageDiv.appendChild(content);

  if (typingRow) container.insertBefore(messageDiv, typingRow);
  else container.appendChild(messageDiv);

  container.scrollTop = container.scrollHeight;
}

function showTypingWidget() {
  const el = document.getElementById('typingIndicatorWidget');
  if (!el) return;
  el.classList.add('active');
  const container = document.getElementById('chatMessagesWidget');
  container.scrollTop = container.scrollHeight;
}

function hideTypingWidget() {
  const el = document.getElementById('typingIndicatorWidget');
  if (!el) return;
  el.classList.remove('active');
}

function sendSuggestionWidget(text) {
  document.getElementById('chatInputWidget').value = text;
  sendMessageWidget();
}

function handleKeyPressWidget(event) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    sendMessageWidget();
  }
}

// Sécurité basique anti-injection HTML dans les messages
function escapeHtml(str) {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

// (Optionnel) Premium access : masque le widget si l’utilisateur n’est pas premium
function checkPremiumAccessWidget() {
  try {
    const userPlan = localStorage.getItem('userPlan');
    if (!userPlan) return;

    const plan = JSON.parse(userPlan);
    if (plan?.name !== 'Premium') {
      document.getElementById('chatWidgetBtn').style.display = 'none';
    }
  } catch (e) {
    // ignore
  }
}

document.addEventListener('DOMContentLoaded', () => {
  checkPremiumAccessWidget();
});
