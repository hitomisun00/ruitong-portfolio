(() => {
  const replaceQuery = (key, value) => {
    const url = new URL(window.location.href);
    url.searchParams.set(key, value);
    window.history.replaceState({}, '', url);
  };

  const wireTabs = ({ tabs, panels, tabKey, panelKey, queryKey, onSelect }) => {
    if (!tabs.length) return;

    const select = (name, moveFocus = false, syncUrl = false) => {
      tabs.forEach((tab) => {
        const selected = tab.dataset[tabKey] === name;
        tab.setAttribute('aria-selected', String(selected));
        tab.tabIndex = selected ? 0 : -1;
        if (selected && moveFocus) tab.focus();
      });

      panels.forEach((panel) => {
        const selected = panel.dataset[panelKey] === name;
        panel.hidden = !selected;
        panel.classList.toggle('is-active', selected);
      });

      if (onSelect) onSelect(name);
      if (syncUrl && queryKey) replaceQuery(queryKey, name);
    };

    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => select(tab.dataset[tabKey], false, true));
      tab.addEventListener('keydown', (event) => {
        if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
        event.preventDefault();
        let nextIndex = index;
        if (event.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length;
        if (event.key === 'ArrowLeft') nextIndex = (index - 1 + tabs.length) % tabs.length;
        if (event.key === 'Home') nextIndex = 0;
        if (event.key === 'End') nextIndex = tabs.length - 1;
        select(tabs[nextIndex].dataset[tabKey], true, true);
      });
    });

    const requested = queryKey ? new URLSearchParams(window.location.search).get(queryKey) : null;
    if (requested && tabs.some((tab) => tab.dataset[tabKey] === requested)) select(requested);
  };

  const layerStack = document.querySelector('[data-layer-stack]');
  const layerTabs = Array.from(document.querySelectorAll('[data-layer-tab]'));
  const layerSheets = Array.from(document.querySelectorAll('[data-layer-sheet]'));
  if (layerStack && layerTabs.length) {
    const selectLayer = (name, moveFocus = false, syncUrl = false) => {
      layerStack.dataset.activeLayer = name;
      layerTabs.forEach((tab) => {
        const selected = tab.dataset.layerTab === name;
        tab.setAttribute('aria-selected', String(selected));
        tab.tabIndex = selected ? 0 : -1;
        if (selected && moveFocus) tab.focus();
      });
      layerSheets.forEach((sheet) => sheet.setAttribute('aria-hidden', String(sheet.dataset.layerSheet !== name)));
      if (syncUrl) replaceQuery('layer', name);
    };

    layerTabs.forEach((tab, index) => {
      tab.addEventListener('click', () => selectLayer(tab.dataset.layerTab, false, true));
      tab.addEventListener('keydown', (event) => {
        if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
        event.preventDefault();
        let nextIndex = index;
        if (event.key === 'ArrowRight') nextIndex = (index + 1) % layerTabs.length;
        if (event.key === 'ArrowLeft') nextIndex = (index - 1 + layerTabs.length) % layerTabs.length;
        if (event.key === 'Home') nextIndex = 0;
        if (event.key === 'End') nextIndex = layerTabs.length - 1;
        selectLayer(layerTabs[nextIndex].dataset.layerTab, true, true);
      });
    });

    const requestedLayer = new URLSearchParams(window.location.search).get('layer');
    if (layerTabs.some((tab) => tab.dataset.layerTab === requestedLayer)) selectLayer(requestedLayer);
  }

  wireTabs({
    tabs: Array.from(document.querySelectorAll('[data-client-example]')),
    panels: Array.from(document.querySelectorAll('[data-client-panel]')),
    tabKey: 'clientExample',
    panelKey: 'clientPanel',
    queryKey: 'example'
  });

  wireTabs({
    tabs: Array.from(document.querySelectorAll('[data-figma-tab]')),
    panels: Array.from(document.querySelectorAll('[data-figma-panel]')),
    tabKey: 'figmaTab',
    panelKey: 'figmaPanel',
    queryKey: 'origin'
  });

  const dialog = document.querySelector('[data-configurator-dialog]');
  const openButton = document.querySelector('[data-open-configurator]');
  const closeButton = document.querySelector('[data-close-configurator]');
  if (dialog && openButton && closeButton) {
    const frame = dialog.querySelector('iframe');
    openButton.addEventListener('click', () => {
      if (frame && !frame.src) frame.src = frame.dataset.src;
      dialog.showModal();
    });
    closeButton.addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) dialog.close();
    });
  }
})();
