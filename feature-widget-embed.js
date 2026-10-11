(() => {
  const shell = document.querySelector('[data-widget-id]');
  if (!shell) return;
  const id = shell.dataset.widgetId;
  const host = 'https://sgtr-eks-widgets.genesiv.org';
  const publicOrigin = 'https://ruitong-portfolio26.vercel.app';
  const approvedWidgets = new Set([
    'NmFjNTE0NjkxODk5ODM2MGI3MTQ3M2E2',
    'NmFjNDY0NzAwZjZkOTA3MGFmYjkwMDk1',
    'NmFjNDkzODIzMjY2Y2YxN2MwMTI3ZGEy'
  ]);
  const result = shell.querySelector('.embed-result');
  const status = shell.querySelector('.embed-state');
  const retry = shell.querySelector('[data-widget-retry]');
  if (!approvedWidgets.has(id)) return;
  // Registered CatTrader sample member verified for these exact widgets.
  // The Store uses the same public sample identity. Tokens remain runtime-only.
  const demoEmail = 'ruitong@returning.ai';
  let loader, observer, connectionTimer, renewalTimer;
  let stopped = false, renewing = false, recoveries = 0;
  const container = document.createElement('div');
  container.id = `returning-ai-feature-${id}`;
  result.replaceChildren(container);
  const setStatus = (state, text) => {
    shell.dataset.connection = state;
    status.textContent = text;
  };
  const api = () => window.ReturningAIWidget?.[container.id];
  const clearTimers = () => {
    clearTimeout(connectionTimer);
    clearTimeout(renewalTimer);
  };
  const fail = text => {
    clearTimers();
    observer?.disconnect();
    loader?.remove();
    const message = document.createElement('p');
    message.className = 'feature-widget-origin';
    message.textContent = 'The live sandbox is temporarily unavailable. The feature flow and product evidence remain available below.';
    container.replaceChildren(message);
    setStatus('error', text);
    retry.hidden = false;
  };
  const renew = async () => {
    const iframe = container.querySelector('iframe');
    if (renewing || stopped || !iframe?.isConnected || !api()) return;
    renewing = true;
    try {
      const refreshed = await api().refresh();
      const token = refreshed && await api().getToken();
      if (!token || !iframe.isConnected) throw new Error('Session refresh unavailable');
      const next = new URL(iframe.src);
      next.searchParams.set('token', token);
      iframe.src = next.toString();
      setStatus('loading', 'Refreshing the live widget…');
    } catch {
      try { await api()?.reload(); }
      catch { fail('The live widget is unavailable. Try loading it again.'); }
    } finally {
      renewing = false;
    }
  };
  const connect = () => {
    clearTimers();
    observer?.disconnect();
    loader?.remove();
    stopped = false;
    retry.hidden = true;
    container.style.position = 'relative';
    container.style.minHeight = '600px';
    container.innerHTML = '<div class="feature-widget-loader"><span class="feature-widget-spinner" aria-hidden="true"></span><span>Loading the live widget…</span></div>';
    setStatus('loading', 'Connecting the official CatTrader widget…');
    observer = new MutationObserver(() => {
      const iframe = container.querySelector('iframe');
      if (!iframe) return;
      iframe.title = `CatTrader · ${shell.dataset.widgetName}`;
      observer.disconnect();
    });
    observer.observe(container, {childList: true, subtree: true});
    loader = document.createElement('script');
    loader.src = `${host}/widget-loader.js`;
    Object.assign(loader.dataset, {
      widgetId: id, widgetType: 'custom', container: container.id,
      email: demoEmail, theme: 'light', width: '100%', height: '800px',
      apiUrl: host, widgetUrl: `${host}/custom-widget`, autoRefresh: 'true', debug: 'false'
    });
    loader.addEventListener('error', () => fail('The live widget could not load. Try again.'));
    document.body.append(loader);
    connectionTimer = setTimeout(() => fail('The live widget did not respond. Try loading it again.'), 30000);
  };
  if (location.origin !== publicOrigin) {
    setStatus('local', 'Live widget available on the published portfolio');
    const note = document.createElement('p');
    note.className = 'feature-widget-origin';
    note.textContent = 'This sandbox is authorized on the public portfolio. ';
    const link = document.createElement('a');
    link.href = `${publicOrigin}${location.pathname}#widget`;
    link.textContent = 'Open the live widget ↗';
    note.append(link);
    container.replaceChildren(note);
    return;
  }
  retry.addEventListener('click', () => { recoveries = 0; connect(); });
  window.addEventListener('message', event => {
    const iframe = container.querySelector('iframe');
    if (event.origin !== host || !iframe || event.source !== iframe.contentWindow) return;
    const type = typeof event.data === 'string' ? event.data : event.data?.type;
    if (type === 'WIDGET_READY') {
      clearTimers();
      container.querySelector('.feature-widget-loader')?.remove();
      recoveries = 0;
      retry.hidden = true;
      setStatus('ready', 'Connected · official CatTrader widget');
      renewalTimer = setTimeout(renew, 210000);
    }
    if (type === 'WIDGET_ERROR') {
      if (recoveries++ < 2 && api()) {
        setStatus('loading', 'Reconnecting the live widget…');
        renew();
      } else fail('The live widget is unavailable. Try loading it again.');
    }
    if (type === 'WIDGET_HEIGHT_UPDATE') {
      const height = Number(event.data?.payload?.height);
      if (Number.isFinite(height) && height > 200 && height < 5000) iframe.style.height = `${Math.ceil(height)}px`;
    }
  });
  window.addEventListener('pagehide', () => {
    stopped = true;
    clearTimers();
    observer?.disconnect();
  });
  window.addEventListener('pageshow', event => { if (event.persisted) connect(); });
  connect();
})();
