(() => {
  const isEmbedded = new URLSearchParams(window.location.search).get('embed') === '1';
  document.body.classList.toggle('is-embedded', isEmbedded);
  const bench = document.querySelector('.config-bench');
  const form = document.querySelector('#prompt-form');
  const prompt = document.querySelector('#feature-prompt');
  const sampleButton = document.querySelector('#sample-prompt');
  const promptError = document.querySelector('#prompt-error');
  const emptyState = document.querySelector('#bench-empty');
  const workspace = document.querySelector('#bench-workspace');
  const generatedName = document.querySelector('#generated-feature-name');
  const titleInput = document.querySelector('#widget-title');
  const titleCount = document.querySelector('#title-count');
  const previewTitle = document.querySelector('#preview-title');
  const previewDescription = document.querySelector('#preview-description');
  const previewCopy = document.querySelector('#preview-copy');
  const featureTitle = document.querySelector('#feature-title');
  const featureDescription = document.querySelector('#feature-description');
  const wheelWidget = document.querySelector('#wheel-widget');
  const wheel = document.querySelector('#wheel');
  const pointer = document.querySelector('#wheel-pointer');
  const spinButton = document.querySelector('#spin-button');
  const spinResult = document.querySelector('#spin-result');
  const prizeList = document.querySelector('#prize-list');
  const previewCanvas = document.querySelector('#preview-canvas');

  if (!bench || !form || !prompt || !workspace) return;

  const titleCase = (value) => value
    .toLowerCase()
    .replace(/\b\w/g, (character) => character.toUpperCase());

  const featureNameFromPrompt = (value) => {
    if (/spin|wheel/i.test(value)) return 'Spin the Wheel';
    const match = value.match(/(?:my|for)\s+(.+?)(?:\s+feature)?(?:[.!?]|$)/i);
    return match ? titleCase(match[1].replace(/\bwidget settings?\b/gi, '').trim()) : 'Feature Widget';
  };

  const revealWorkspace = () => {
    const value = prompt.value.trim();
    if (!value) {
      prompt.focus();
      prompt.setAttribute('aria-invalid', 'true');
      promptError.hidden = false;
      return;
    }
    prompt.removeAttribute('aria-invalid');
    promptError.hidden = true;
    const featureName = featureNameFromPrompt(value);
    generatedName.textContent = featureName;
    titleInput.value = `${featureName} Widget`.slice(0, 60);
    titleCount.textContent = `${titleInput.value.length} / 60`;
    emptyState.hidden = true;
    workspace.hidden = false;
    bench.dataset.benchState = 'generated';
    if (!isEmbedded) workspace.scrollIntoView({ block: 'nearest', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  };

  sampleButton.addEventListener('click', () => {
    prompt.value = 'Create widget settings for my spin the wheel feature';
    prompt.removeAttribute('aria-invalid');
    promptError.hidden = true;
    prompt.focus();
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    revealWorkspace();
  });

  titleInput.addEventListener('input', () => {
    titleCount.textContent = `${titleInput.value.length} / 60`;
  });

  const tabButtons = [...document.querySelectorAll('[data-tab]')];
  const tabPanels = [...document.querySelectorAll('.tab-panel')];

  const activateTab = (name, focus = false) => {
    tabButtons.forEach((button) => {
      const selected = button.dataset.tab === name;
      button.setAttribute('aria-selected', String(selected));
      button.tabIndex = selected ? 0 : -1;
      if (selected && focus) button.focus();
    });
    tabPanels.forEach((panel) => { panel.hidden = panel.id !== `${name}-panel`; });
  };

  tabButtons.forEach((button) => button.addEventListener('click', () => activateTab(button.dataset.tab)));
  tabButtons.forEach((button, index) => button.addEventListener('keydown', (event) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    let nextIndex = index;
    if (event.key === 'ArrowRight') nextIndex = (index + 1) % tabButtons.length;
    if (event.key === 'ArrowLeft') nextIndex = (index - 1 + tabButtons.length) % tabButtons.length;
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = tabButtons.length - 1;
    activateTab(tabButtons[nextIndex].dataset.tab, true);
  }));
  activateTab('settings');
  document.querySelectorAll('[data-target-tab]').forEach((button) => {
    button.addEventListener('click', () => {
      activateTab(button.dataset.targetTab);
      const target = document.querySelector(`#${button.dataset.targetGroup}`);
      if (!target) return;
      target.scrollIntoView({ block: 'start', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
      target.classList.add('attention-pulse');
      window.setTimeout(() => target.classList.remove('attention-pulse'), 700);
    });
  });

  document.querySelectorAll('.accordion__trigger').forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const accordion = trigger.closest('.accordion');
      const content = accordion.querySelector('.accordion__content');
      const open = trigger.getAttribute('aria-expanded') !== 'true';
      trigger.setAttribute('aria-expanded', String(open));
      accordion.classList.toggle('is-open', open);
      content.hidden = !open;
    });
  });

  const updateVisibility = () => {
    const showHeader = document.querySelector('#show-header').checked;
    const showDescription = document.querySelector('#show-description').checked;
    previewTitle.hidden = !showHeader;
    previewDescription.hidden = !showDescription;
    previewCopy.hidden = !showHeader && !showDescription;
    pointer.hidden = !document.querySelector('#show-pointer').checked;
    wheel.querySelectorAll('span').forEach((label) => { label.hidden = !document.querySelector('#show-labels').checked; });
    spinButton.hidden = !document.querySelector('#show-cta').checked;
    prizeList.hidden = !document.querySelector('#show-prize-list').checked;
  };

  ['show-header', 'show-description', 'show-pointer', 'show-labels', 'show-cta', 'show-prize-list'].forEach((id) => {
    document.querySelector(`#${id}`).addEventListener('change', updateVisibility);
  });

  featureTitle.addEventListener('input', () => {
    previewTitle.textContent = featureTitle.value || 'Untitled widget';
    const inheritance = document.querySelector('#use-feature-settings');
    inheritance.checked = false;
  });
  featureDescription.addEventListener('input', () => {
    previewDescription.textContent = featureDescription.value;
    document.querySelector('#use-feature-settings').checked = false;
  });
  document.querySelector('#use-feature-settings').addEventListener('change', (event) => {
    if (!event.target.checked) return;
    featureTitle.value = 'Spin the Wheel';
    featureDescription.value = 'Spin for a chance to reveal your next reward.';
    previewTitle.textContent = featureTitle.value;
    previewDescription.textContent = featureDescription.value;
  });

  document.querySelectorAll('input[name="layout"]').forEach((radio) => {
    radio.addEventListener('change', () => {
      wheelWidget.classList.toggle('is-split', radio.value === 'split' && radio.checked);
      if (radio.value === 'split' && radio.checked) document.querySelector('#show-prize-list').checked = true;
      updateVisibility();
    });
  });

  const fixedDimensions = document.querySelector('#fixed-dimensions');
  const fixedWidth = document.querySelector('#fixed-width');
  const fixedHeight = document.querySelector('#fixed-height');
  const updateDisplayBehaviour = () => {
    const fixed = document.querySelector('input[name="display"][value="fixed"]').checked;
    fixedDimensions.hidden = !fixed;
    wheelWidget.style.width = fixed ? `${fixedWidth.value}px` : '';
    wheelWidget.style.minHeight = fixed ? `${fixedHeight.value}px` : '';
  };
  document.querySelectorAll('input[name="display"]').forEach((radio) => radio.addEventListener('change', updateDisplayBehaviour));
  fixedWidth.addEventListener('input', updateDisplayBehaviour);
  fixedHeight.addEventListener('input', updateDisplayBehaviour);

  document.querySelectorAll('[data-preview-mode]').forEach((button) => {
    button.addEventListener('click', () => {
      document.querySelectorAll('[data-preview-mode]').forEach((candidate) => candidate.classList.toggle('is-active', candidate === button));
      previewCanvas.classList.toggle('is-mobile', button.dataset.previewMode === 'mobile');
    });
  });

  let rotation = 0;
  spinButton.addEventListener('click', () => {
    rotation += 810;
    wheel.style.transform = `rotate(${rotation}deg)`;
    spinResult.textContent = '';
    const delay = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 900;
    window.setTimeout(() => { spinResult.textContent = 'Preview result: 20 points'; }, delay);
  });

  const colorControls = {
    'accent-color': ['--widget-accent', 'accent-output'],
    'text-color': ['--widget-text', 'text-output'],
    'background-color': ['--widget-bg', 'background-output'],
    'divider-color': ['--widget-divider', 'divider-output'],
    'surface-color': ['--widget-surface'],
    'section-color': ['--widget-section']
  };
  Object.entries(colorControls).forEach(([id, [property, outputId]]) => {
    const input = document.querySelector(`#${id}`);
    if (!input) return;
    input.addEventListener('input', () => {
      wheelWidget.style.setProperty(property, input.value);
      if (outputId) document.querySelector(`#${outputId}`).textContent = input.value.toUpperCase();
    });
  });

  const numericControls = {
    'stroke-width': '--widget-stroke',
    'radius-control': '--widget-radius',
    'padding-control': '--widget-padding',
    'gap-control': '--widget-gap',
    'section-radius': '--section-radius'
  };
  Object.entries(numericControls).forEach(([id, property]) => {
    document.querySelector(`#${id}`).addEventListener('input', (event) => {
      wheelWidget.style.setProperty(property, `${event.target.value || 0}px`);
    });
  });

  document.querySelector('#show-dividers').addEventListener('change', (event) => {
    wheelWidget.classList.toggle('show-dividers', event.target.checked);
    prizeList.style.borderWidth = event.target.checked ? '1px' : '0px';
  });

  document.querySelector('#font-select').addEventListener('change', (event) => {
    wheelWidget.classList.toggle('is-system-font', event.target.value === 'system');
    wheelWidget.classList.toggle('is-rounded-font', event.target.value === 'rounded');
  });

  const presets = {
    amber: { accent: '#F0BB00', text: '#FFFFFF', background: '#0C0B04', divider: '#636161', surface: '#11100C', section: '#171612', radius: 4, padding: 16, gap: 16, font: 'roboto' },
    paper: { accent: '#C5A645', text: '#2A2822', background: '#F5EED9', divider: '#C9BEA0', surface: '#F9F5E8', section: '#EEE4C8', radius: 8, padding: 18, gap: 14, font: 'system' },
    coral: { accent: '#F0745A', text: '#FFF8F3', background: '#2B1814', divider: '#7B4A3E', surface: '#351E18', section: '#40261F', radius: 12, padding: 18, gap: 14, font: 'rounded' },
    rose: { accent: '#EF7D8B', text: '#FFF9FA', background: '#241A1D', divider: '#74535C', surface: '#2D2024', section: '#38272D', radius: 16, padding: 20, gap: 16, font: 'rounded' },
    sand: { accent: '#E8B79F', text: '#FFF9F5', background: '#2D2024', divider: '#775661', surface: '#39282D', section: '#433037', radius: 8, padding: 18, gap: 16, font: 'system' },
    apple: { accent: '#0071E3', text: '#1D1D1F', background: '#F5F5F7', divider: '#D2D2D7', surface: '#FFFFFF', section: '#FFFFFF', radius: 22, padding: 24, gap: 16, font: 'system' }
  };

  const setInput = (id, value, eventName = 'input') => {
    const input = document.querySelector(`#${id}`);
    input.value = value;
    input.dispatchEvent(new Event(eventName, { bubbles: true }));
  };

  document.querySelectorAll('[data-theme-preset]').forEach((button) => {
    button.addEventListener('click', () => {
      const preset = presets[button.dataset.themePreset];
      document.querySelectorAll('[data-theme-preset]').forEach((candidate) => candidate.setAttribute('aria-pressed', String(candidate === button)));
      setInput('accent-color', preset.accent);
      setInput('text-color', preset.text);
      setInput('background-color', preset.background);
      setInput('divider-color', preset.divider);
      setInput('surface-color', preset.surface);
      setInput('section-color', preset.section);
      setInput('radius-control', preset.radius);
      setInput('padding-control', preset.padding);
      setInput('gap-control', preset.gap);
      setInput('section-radius', preset.radius);
      setInput('font-select', preset.font, 'change');
    });
  });

  document.querySelectorAll('[data-theme-mode]').forEach((button) => {
    button.addEventListener('click', () => {
      document.querySelectorAll('[data-theme-mode]').forEach((candidate) => candidate.classList.toggle('is-active', candidate === button));
      const preset = button.dataset.themeMode === 'light' ? 'paper' : 'amber';
      document.querySelector(`[data-theme-preset="${preset}"]`).click();
    });
  });
})();
