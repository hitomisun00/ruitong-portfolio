(() => {
  const container = document.querySelector('#returning-ai-widget-NjlmMzJiZTk3MjMzMzkwZjVhYzQzNzk1');
  const status = document.querySelector('#live-widget-status');
  if (!container || !status) return;

  const widgetOrigin = 'https://sgtr-eks-widgets.genesiv.org';
  const widgetId = 'NjlmMzJiZTk3MjMzMzkwZjVhYzQzNzk1';
  const demoEmail = 'pangray2025+t5@gmail.com';
  let observer;
  let frameRetryTimer;
  let sessionRenewalTimer;
  let sessionRenewalInProgress = false;
  let widgetReady = false;
  let recoveryAttempts = 0;

  const widgetApi = () => window.ReturningAIWidget?.[container.id];

  const setStatus = (state, message) => {
    status.dataset.state = state;
    status.querySelector('.live-widget-status__copy').textContent = message;
  };

  const setWidgetHeight = rawHeight => {
    const height = Math.ceil(Number(rawHeight));
    if (!Number.isFinite(height) || height < 480 || height > 5000) return;
    container.style.height = `${height}px`;
  };

  const renewIframeSession = async iframe => {
    if (sessionRenewalInProgress || !iframe?.isConnected) return;
    const api = widgetApi();
    if (!api) return;

    sessionRenewalInProgress = true;
    try {
      const refreshed = await api.refresh();
      if (!refreshed) throw new Error('Token refresh did not complete');
      const token = await api.getToken();
      if (!token || !iframe.isConnected) throw new Error('No refreshed token is available');

      const nextUrl = new URL(iframe.src);
      nextUrl.searchParams.set('token', token);
      iframe.src = nextUrl.toString();
      setStatus('loading', 'Refreshing the authenticated widget session…');
    } catch {
      await api.reload();
    } finally {
      sessionRenewalInProgress = false;
    }
  };

  const scheduleSessionRenewal = iframe => {
    clearTimeout(sessionRenewalTimer);
    sessionRenewalTimer = setTimeout(() => renewIframeSession(iframe), 210000);
  };

  const renderLoader = () => {
    container.replaceChildren();
    const loader = document.createElement('div');
    loader.className = 'widget-loader store-widget-loader';
    loader.dataset.loaderType = 'css';
    loader.dataset.loadingBackground = 'var(--dark-background-5, #1a1a1a)';
    loader.innerHTML = '<div class="store-widget-loader__content"><span class="store-widget-spinner" aria-hidden="true"></span><span>Loading Store widget…</span></div>';
    container.append(loader);
  };

  const watchForIframe = () => {
    observer?.disconnect();
    observer = new MutationObserver(() => {
      const iframe = container.querySelector('iframe');
      if (!iframe) return;

      iframe.title = iframe.title || 'TR5 Store widget';
      setStatus('loading', 'The widget frame is authenticating with the TR5 sandbox…');
      observer.disconnect();

      const authenticatedWidgetUrl = iframe.src;
      clearTimeout(frameRetryTimer);
      frameRetryTimer = setTimeout(async () => {
        if (widgetReady || !iframe.isConnected) return;

        let frameIsBlank = false;
        try {
          const frameBody = iframe.contentDocument?.body;
          frameIsBlank = Boolean(
            frameBody &&
            frameBody.childElementCount === 0 &&
            !frameBody.textContent.trim()
          );
        } catch {
          return;
        }

        if (!frameIsBlank) return;
        setStatus('loading', 'The browser paused the iframe navigation. Retrying the authenticated widget…');
        const nextUrl = new URL(authenticatedWidgetUrl);
        const token = await widgetApi()?.getToken?.();
        if (token) nextUrl.searchParams.set('token', token);
        iframe.src = 'about:blank';
        setTimeout(() => {
          iframe.src = nextUrl.toString();
        }, 0);
      }, 4000);
    });
    observer.observe(container, { childList: true, subtree: true });
  };

  window.addEventListener('message', event => {
    if (event.origin !== widgetOrigin) return;
    const messageType = typeof event.data === 'string' ? event.data : event.data?.type;

    if (messageType === 'WIDGET_HEIGHT_UPDATE') {
      setWidgetHeight(event.data?.payload?.height);
      return;
    }

    if (messageType === 'WIDGET_READY') {
      widgetReady = true;
      recoveryAttempts = 0;
      clearTimeout(frameRetryTimer);
      const iframe = container.querySelector('iframe');
      if (iframe) scheduleSessionRenewal(iframe);
      setStatus('ready', 'Connected. The live TR5 Store widget is ready to explore.');
      return;
    }

    if (messageType === 'WIDGET_ERROR') {
      const iframe = container.querySelector('iframe');
      if (iframe && recoveryAttempts < 2) {
        recoveryAttempts += 1;
        setStatus('loading', 'The widget session was interrupted. Reconnecting…');
        renewIframeSession(iframe);
      } else {
        setStatus('error', 'The TR5 sandbox did not respond. Refresh this page to try again.');
      }
    }
  });

  renderLoader();
  watchForIframe();

  const script = document.createElement('script');
  script.id = 'returning-ai-widget-loader';
  script.src = `${widgetOrigin}/widget-loader.js`;
  script.dataset.widgetId = widgetId;
  script.dataset.widgetType = 'custom';
  script.dataset.container = container.id;
  script.dataset.email = demoEmail;
  script.dataset.theme = 'dark';
  script.dataset.width = '100%';
  script.dataset.height = 'clamp(760px, 85svh, 1100px)';
  script.dataset.apiUrl = widgetOrigin;
  script.dataset.widgetUrl = `${widgetOrigin}/custom-widget`;
  script.dataset.autoRefresh = 'true';
  script.dataset.debug = 'false';
  script.addEventListener('error', () => {
    observer?.disconnect();
    setStatus('error', 'The remote TR5 widget loader could not be downloaded.');
  });
  document.body.append(script);
})();
