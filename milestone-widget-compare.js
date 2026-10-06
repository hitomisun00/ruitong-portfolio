(() => {
  const widgetOrigin = 'https://sgtr-eks-widgets.genesiv.org';
  const publicHost = 'ruitong-portfolio26.vercel.app';
  const portals = Array.from(document.querySelectorAll('[data-milestone-widget]'));
  if (!portals.length) return;

  const instances = new Map();

  const setStatus = (instance, state, message) => {
    instance.status.dataset.state = state;
    const copy = instance.status.querySelector('b');
    if (copy) copy.textContent = message;
  };

  const renderOriginNote = (instance, heading, copy) => {
    instance.container.replaceChildren();
    const note = document.createElement('div');
    note.className = 'milestone-widget-origin-note';
    const label = document.createElement('span');
    label.textContent = 'Authorized-origin preview';
    const title = document.createElement('strong');
    title.textContent = heading;
    const body = document.createElement('p');
    body.textContent = copy;
    note.append(label, title, body);
    instance.container.append(note);
  };

  const renderLoader = instance => {
    instance.container.replaceChildren();
    const loader = document.createElement('div');
    loader.className = 'widget-loader milestone-widget-loader';
    loader.dataset.loaderType = 'css';
    loader.dataset.loadingBackground = `var(--${instance.theme}-background-5)`;
    loader.innerHTML = '<div class="milestone-widget-loader__content"><i aria-hidden="true"></i><span>Loading Milestones widget…</span></div>';
    instance.container.append(loader);
  };

  const mount = instance => {
    renderLoader(instance);
    setStatus(instance, 'loading', 'Authenticating sandbox');

    const script = document.createElement('script');
    script.src = `${widgetOrigin}/widget-loader.js`;
    script.dataset.widgetId = instance.widgetId;
    script.dataset.widgetType = 'custom';
    script.dataset.container = instance.container.id;
    script.dataset.email = instance.email;
    script.dataset.theme = instance.theme;
    script.dataset.width = '100%';
    script.dataset.height = '760px';
    script.dataset.apiUrl = widgetOrigin;
    script.dataset.widgetUrl = `${widgetOrigin}/custom-widget`;
    script.dataset.autoRefresh = 'true';
    script.dataset.debug = 'false';
    script.addEventListener('error', () => {
      setStatus(instance, 'error', 'Loader unavailable');
      renderOriginNote(instance, 'The remote widget could not be reached.', 'The comparison copy remains available while the external sandbox is offline.');
    });
    document.body.append(script);
  };

  portals.forEach(portal => {
    const widgetId = portal.dataset.widgetId;
    const container = portal.querySelector('.milestone-widget-container');
    const status = document.getElementById(container?.dataset.statusId || '');
    const email = portal.dataset.demoEmail?.trim() || '';
    const theme = portal.dataset.theme === 'light' ? 'light' : 'dark';
    if (!widgetId || !container || !status) return;

    const instance = { widgetId, container, status, email, theme };
    instances.set(container.id, instance);

    if (window.location.protocol !== 'https:' || window.location.hostname !== publicHost) {
      setStatus(instance, 'idle', 'Public origin only');
      renderOriginNote(instance, 'The live client widget loads after publication.', 'Its saved access policy accepts only the authorized portfolio origin; this local frame preserves the final layout without attempting authentication.');
      return;
    }

    if (!email) {
      setStatus(instance, 'error', 'Demo identity needed');
      renderOriginNote(instance, 'The embed is ready for its public demo identity.', 'A Simple Embed user identifier must be added before this widget can authenticate on the published portfolio.');
      return;
    }

    mount(instance);
  });

  window.addEventListener('message', event => {
    if (event.origin !== widgetOrigin || !event.data) return;
    const instance = instances.get(event.data.containerId);
    if (!instance || event.data.widgetId !== instance.widgetId) return;

    if (event.data.type === 'WIDGET_READY') {
      setStatus(instance, 'ready', 'Live and interactive');
      return;
    }

    if (event.data.type === 'WIDGET_ERROR') {
      setStatus(instance, 'error', 'Sandbox unavailable');
    }
  });
})();
