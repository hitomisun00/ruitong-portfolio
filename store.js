(() => {
  document.body.classList.remove('no-js');

  const instrument = document.querySelector('[data-redemption-instrument]');
  if (!instrument) return;

  const methods = {
    delivery: {
      method: 'Physical delivery',
      description: 'Ship the product to the trader’s preferred address.',
      fields: 'Name · Address · Phone number',
      condition: 'Check delivery region and required contact data',
      outcome: 'Delivery order enters purchase history'
    },
    credit: {
      method: 'Credit to account',
      description: 'Exchange the product value for trading credit.',
      fields: 'Trading account · Account name',
      condition: 'Verify account and eligible value',
      outcome: 'Credit request enters purchase history'
    }
  };

  const buttons = Array.from(instrument.querySelectorAll('[data-method-choice]'));
  const renderMethod = (name, moveFocus = false) => {
    const method = methods[name];
    if (!method) return;
    instrument.dataset.method = name;
    instrument.querySelector('[data-flow-method]').textContent = method.method;
    instrument.querySelector('[data-flow-description]').textContent = method.description;
    instrument.querySelector('[data-flow-fields]').textContent = method.fields;
    instrument.querySelector('[data-flow-condition]').textContent = method.condition;
    instrument.querySelector('[data-flow-outcome]').textContent = method.outcome;
    buttons.forEach((button) => {
      const selected = button.dataset.methodChoice === name;
      button.setAttribute('aria-checked', String(selected));
      button.tabIndex = selected ? 0 : -1;
      if (selected && moveFocus) button.focus();
    });
  };

  buttons.forEach((button, index) => {
    button.addEventListener('click', () => renderMethod(button.dataset.methodChoice));
    button.addEventListener('keydown', (event) => {
      if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      let nextIndex = index;
      if (['ArrowDown', 'ArrowRight'].includes(event.key)) nextIndex = (index + 1) % buttons.length;
      if (['ArrowUp', 'ArrowLeft'].includes(event.key)) nextIndex = (index - 1 + buttons.length) % buttons.length;
      if (event.key === 'Home') nextIndex = 0;
      if (event.key === 'End') nextIndex = buttons.length - 1;
      renderMethod(buttons[nextIndex].dataset.methodChoice, true);
    });
  });
})();
