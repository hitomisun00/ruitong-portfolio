(() => {
  const resolver = document.querySelector('[data-resolver]');
  if (!resolver) return;

  const state = { role: 'view', source: 'category' };
  const title = resolver.querySelector('[data-result-title]');
  const trace = resolver.querySelector('[data-result-trace]');

  const copy = {
    none: {
      title: 'The Store stays hidden.',
      lines: [
        'Role access stops the journey before catalogue rules are evaluated.',
        'No product or redemption configuration can override that boundary.'
      ]
    },
    view: {
      title: 'The catalogue is visible, but purchasing is disabled.',
      lines: [
        'Role access resolves to view only.',
        'The selected product can be inspected without exposing a checkout action.'
      ]
    },
    full: {
      store: [
        'Full role access passes the first gate.',
        'The product inherits the Store-level redemption method.',
        'Checkout can proceed when the required fields are complete.'
      ],
      category: [
        'Full role access passes the first gate.',
        'The Category rule overrides the Store default.',
        'Checkout uses the category-level redemption method and fields.'
      ],
      product: [
        'Full role access passes the first gate.',
        'The Product rule wins over Category and Store defaults.',
        'Checkout uses the most specific valid configuration.'
      ]
    }
  };

  const render = () => {
    const result = copy[state.role];
    const lines = state.role === 'full' ? result[state.source] : result.lines;
    title.textContent = state.role === 'full'
      ? `${state.source[0].toUpperCase()}${state.source.slice(1)} configuration wins.`
      : result.title;
    trace.replaceChildren(...lines.map(line => {
      const item = document.createElement('li');
      item.textContent = line;
      return item;
    }));
  };

  resolver.querySelectorAll('button[data-group]').forEach(button => {
    button.addEventListener('click', () => {
      const group = button.dataset.group;
      state[group] = button.dataset.value;
      resolver.querySelectorAll(`button[data-group="${group}"]`).forEach(option => {
        option.setAttribute('aria-pressed', String(option === button));
      });
      render();
    });
  });

  render();
})();
