(() => {
  const resolver = document.querySelector('[data-widget-resolver]');
  if (resolver) {
    const state = { source: 'Milestones', override: '' };
    const value = resolver.querySelector('[data-resolved-value]');
    const sourceTrace = resolver.querySelector('[data-source-trace]');
    const overrideTrace = resolver.querySelector('[data-override-trace]');

    const render = () => {
      value.textContent = state.override || state.source;
      sourceTrace.textContent = `Reading the current feature value: “${state.source}”`;
      overrideTrace.textContent = state.override
        ? `Explicit widget override wins: “${state.override}”`
        : 'No widget override exists; inheritance remains live';
    };

    resolver.querySelectorAll('button[data-resolver-group]').forEach((button) => {
      button.addEventListener('click', () => {
        const group = button.dataset.resolverGroup;
        state[group] = button.dataset.value;
        resolver.querySelectorAll(`button[data-resolver-group="${group}"]`).forEach((candidate) => {
          candidate.setAttribute('aria-pressed', String(candidate === button));
        });
        render();
      });
    });

    render();
  }

  const originTabs = Array.from(document.querySelectorAll('[data-origin-tab]'));
  const originPanels = Array.from(document.querySelectorAll('[data-origin-panel]'));

  const selectOriginLayer = (name, moveFocus = false, syncUrl = false) => {
    originTabs.forEach((tab) => {
      const selected = tab.dataset.originTab === name;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
      if (selected && moveFocus) tab.focus();
    });

    originPanels.forEach((panel) => {
      const selected = panel.dataset.originPanel === name;
      panel.hidden = !selected;
      panel.classList.toggle('is-active', selected);
      if (selected) {
        const scrollRegion = panel.querySelector('.origin-scroll');
        if (scrollRegion) scrollRegion.scrollTop = 0;
      }
    });

    if (syncUrl) {
      const url = new URL(window.location.href);
      url.searchParams.set('origin', name);
      window.history.replaceState({}, '', url);
    }
  };

  originTabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectOriginLayer(tab.dataset.originTab, false, true));
    tab.addEventListener('keydown', (event) => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      let nextIndex = index;
      if (event.key === 'ArrowRight') nextIndex = (index + 1) % originTabs.length;
      if (event.key === 'ArrowLeft') nextIndex = (index - 1 + originTabs.length) % originTabs.length;
      if (event.key === 'Home') nextIndex = 0;
      if (event.key === 'End') nextIndex = originTabs.length - 1;
      selectOriginLayer(originTabs[nextIndex].dataset.originTab, true, true);
    });
  });

  const requestedOrigin = new URLSearchParams(window.location.search).get('origin');
  if (originTabs.some((tab) => tab.dataset.originTab === requestedOrigin)) {
    selectOriginLayer(requestedOrigin);
  }

  const clientTabs = Array.from(document.querySelectorAll('[data-client-example]'));
  const clientPanels = Array.from(document.querySelectorAll('[data-client-panel]'));

  const selectClientExample = (name, moveFocus = false, syncUrl = false) => {
    clientTabs.forEach((tab) => {
      const selected = tab.dataset.clientExample === name;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
      if (selected && moveFocus) tab.focus();
    });

    clientPanels.forEach((panel) => {
      const selected = panel.dataset.clientPanel === name;
      panel.hidden = !selected;
      panel.classList.toggle('is-active', selected);
    });

    if (syncUrl) {
      const url = new URL(window.location.href);
      url.searchParams.set('example', name);
      window.history.replaceState({}, '', url);
    }
  };

  clientTabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectClientExample(tab.dataset.clientExample, false, true));
    tab.addEventListener('keydown', (event) => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      let nextIndex = index;
      if (event.key === 'ArrowRight') nextIndex = (index + 1) % clientTabs.length;
      if (event.key === 'ArrowLeft') nextIndex = (index - 1 + clientTabs.length) % clientTabs.length;
      if (event.key === 'Home') nextIndex = 0;
      if (event.key === 'End') nextIndex = clientTabs.length - 1;
      selectClientExample(clientTabs[nextIndex].dataset.clientExample, true, true);
    });
  });

  const requestedExample = new URLSearchParams(window.location.search).get('example');
  if (clientTabs.some((tab) => tab.dataset.clientExample === requestedExample)) {
    selectClientExample(requestedExample);
  }
})();
