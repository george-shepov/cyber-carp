const nav = document.querySelector('.site-nav');
const menuToggle = document.querySelector('.menu-toggle');
menuToggle?.addEventListener('click', () => {
  const open = nav.classList.toggle('is-open');
  menuToggle.setAttribute('aria-expanded', String(open));
});
nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  nav.classList.remove('is-open');
  menuToggle?.setAttribute('aria-expanded', 'false');
}));

document.querySelectorAll('.filter').forEach((button) => button.addEventListener('click', () => {
  document.querySelectorAll('.filter').forEach((item) => item.classList.remove('active'));
  button.classList.add('active');
  const filter = button.dataset.filter;
  document.querySelectorAll('[data-project]').forEach((card) => {
    card.hidden = filter !== 'all' && card.dataset.category !== filter;
  });
}));

document.querySelectorAll('.inline-estimate').forEach((button) => button.addEventListener('click', () => {
  const removal = document.querySelector('[name="removal"]');
  const value = button.dataset.category;
  [...removal.options].some((option) => {
    if (option.textContent.toLowerCase().includes(value.split(' ')[0].toLowerCase())) {
      removal.value = option.value;
      return true;
    }
    return false;
  });
  document.querySelector('#estimate').scrollIntoView({ behavior: 'smooth' });
  document.querySelector('[name="name"]')?.focus({ preventScroll: true });
}));

const dialog = document.querySelector('#project-dialog');
document.querySelectorAll('[data-project-open]').forEach((button) => button.addEventListener('click', () => {
  document.querySelector('#dialog-title').textContent = button.dataset.projectOpen;
  dialog.showModal();
}));
document.querySelector('[data-dialog-close]')?.addEventListener('click', () => dialog.close());
dialog?.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });

const leadForm = document.querySelector('#lead-form');
const maxUploadBytes = 25 * 1024 * 1024;
leadForm?.querySelector('[name="media"]')?.addEventListener('change', (event) => {
  const files = [...event.target.files];
  const status = leadForm.querySelector('.form-status');
  const invalid = files.find((file) => file.size > maxUploadBytes);
  if (files.length > 5 || invalid) {
    event.target.value = '';
    status.textContent = invalid ? `${invalid.name} is larger than 25 MB. Please choose a shorter or smaller file.` : 'Please attach no more than 5 files.';
    status.className = 'form-status error';
  }
});
leadForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const status = leadForm.querySelector('.form-status');
  if (!leadForm.checkValidity()) {
    status.textContent = 'Please complete the required fields so the operator can review your project.';
    status.className = 'form-status error';
    leadForm.reportValidity();
    return;
  }
  const reference = `CC-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
  status.textContent = `Demo confirmation: inquiry ${reference} is ready. Connect this form to the production lead endpoint before launch.`;
  status.className = 'form-status success';
  leadForm.reset();
});

const chat = document.querySelector('.chat-panel');
const openChat = () => { chat.classList.add('is-open'); chat.setAttribute('aria-hidden', 'false'); document.querySelector('#chat-text')?.focus(); };
const closeChat = () => { chat.classList.remove('is-open'); chat.setAttribute('aria-hidden', 'true'); };
document.querySelectorAll('[data-chat-open]').forEach((button) => button.addEventListener('click', openChat));
document.querySelector('[data-chat-close]')?.addEventListener('click', closeChat);
document.querySelectorAll('[data-chat-reply]').forEach((button) => button.addEventListener('click', () => addChatMessage(button.dataset.chatReply, true)));

function addChatMessage(message, user = false) {
  const container = document.querySelector('#chat-messages');
  const bubble = document.createElement('div');
  bubble.className = `chat-bubble ${user ? 'user' : 'assistant'}`;
  bubble.textContent = message;
  container.appendChild(bubble);
  if (user) {
    const answer = document.createElement('div');
    answer.className = 'chat-bubble assistant';
    answer.textContent = 'Thanks. What material is underneath, and approximately how large is the area? You can send the full project details below for operator review.';
    container.appendChild(answer);
  }
  container.scrollTop = container.scrollHeight;
}
document.querySelector('#chat-form')?.addEventListener('submit', (event) => {
  event.preventDefault();
  const input = document.querySelector('#chat-text');
  if (!input.value.trim()) return;
  addChatMessage(input.value.trim(), true);
  input.value = '';
});

// Production hook: replace this demo handler with POST /api/leads and signed upload flow.
document.querySelector('.media-play')?.addEventListener('click', (event) => {
  event.currentTarget.setAttribute('aria-label', 'Hero footage placeholder: add authentic video before launch');
  event.currentTarget.textContent = '✓';
});
