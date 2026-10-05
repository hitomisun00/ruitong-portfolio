(() => {
  const isEmbedded = new URLSearchParams(window.location.search).get('embed') === '1';
  document.body.classList.toggle('is-embedded', isEmbedded);

  const form = document.querySelector('#prompt-form');
  const prompt = document.querySelector('#feature-prompt');
  const promptError = document.querySelector('#prompt-error');
  const thread = document.querySelector('#chat-thread');
  const template = document.querySelector('#control-proposal-template');
  const submitButton = form?.querySelector('button[type="submit"]');

  if (!form || !prompt || !thread || !template || !submitButton) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const titleCase = (value) => value
    .toLowerCase()
    .replace(/\b\w/g, (character) => character.toUpperCase());

  const featureNameFromPrompt = (value) => {
    if (/milestone/i.test(value)) return 'Milestones';
    if (/streak/i.test(value)) return 'Streaks';
    if (/store|catalog/i.test(value)) return 'Store';
    if (/spin|wheel/i.test(value)) return 'Spin the Wheel';
    const match = value.match(/(?:for|a|an)\s+(.+?)(?:\s+feature)?(?:\s+with|[.!?]|$)/i);
    return match ? titleCase(match[1].replace(/\bwidget (?:controls?|settings?)\b/gi, '').trim()) : 'Feature Widget';
  };

  const scrollToLatest = () => {
    thread.scrollTo({
      top: thread.scrollHeight,
      behavior: reducedMotion.matches ? 'auto' : 'smooth'
    });
  };

  const createUserMessage = (value) => {
    const article = document.createElement('article');
    article.className = 'chat-message chat-message--user';
    const body = document.createElement('div');
    body.className = 'chat-message__body';
    const author = document.createElement('span');
    author.className = 'chat-author';
    author.textContent = 'You';
    const copy = document.createElement('p');
    copy.textContent = value;
    body.append(author, copy);
    article.append(body);
    return article;
  };

  const createTypingMessage = () => {
    const article = document.createElement('article');
    article.className = 'chat-message chat-message--assistant typing-message';
    article.setAttribute('aria-label', 'Widget Configurator is drafting a control proposal');
    article.innerHTML = '<span class="chat-avatar" aria-hidden="true">W</span><div class="typing-dots" aria-hidden="true"><i></i><i></i><i></i></div>';
    return article;
  };

  const generateProposal = (value) => {
    prompt.removeAttribute('aria-invalid');
    promptError.hidden = true;
    submitButton.disabled = true;
    thread.append(createUserMessage(value));
    const typing = createTypingMessage();
    thread.append(typing);
    prompt.value = '';
    prompt.style.height = '';
    scrollToLatest();

    window.setTimeout(() => {
      typing.remove();
      const proposal = template.content.cloneNode(true);
      proposal.querySelector('[data-proposal-title]').textContent = `${featureNameFromPrompt(value)} widget`;
      thread.append(proposal);
      submitButton.disabled = false;
      scrollToLatest();
      prompt.focus();
    }, reducedMotion.matches ? 0 : 520);
  };

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const value = prompt.value.trim();
    if (!value) {
      prompt.setAttribute('aria-invalid', 'true');
      promptError.hidden = false;
      prompt.focus();
      return;
    }
    generateProposal(value);
  });

  prompt.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' || event.shiftKey || event.isComposing) return;
    event.preventDefault();
    form.requestSubmit();
  });

  prompt.addEventListener('input', () => {
    prompt.removeAttribute('aria-invalid');
    promptError.hidden = true;
    prompt.style.height = 'auto';
    prompt.style.height = `${Math.min(prompt.scrollHeight, 128)}px`;
  });

  document.querySelectorAll('[data-sample-prompt]').forEach((button) => {
    button.addEventListener('click', () => {
      prompt.value = button.dataset.samplePrompt;
      prompt.dispatchEvent(new Event('input'));
      prompt.focus();
    });
  });
})();
