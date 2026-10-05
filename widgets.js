(() => {
  const resolver = document.querySelector('[data-widget-resolver]');
  if (!resolver) return;

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
})();
