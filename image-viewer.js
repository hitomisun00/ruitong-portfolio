(() => {
  const dialog = document.querySelector('[data-image-viewer]');
  const viewerImage = dialog?.querySelector('[data-image-viewer-image]');
  const viewerTitle = dialog?.querySelector('[data-image-viewer-title]');
  const closeButton = dialog?.querySelector('[data-close-image-viewer]');
  if (!dialog || !viewerImage || !viewerTitle || !closeButton) return;

  const sources = Array.from(document.querySelectorAll([
    '[data-image-zoom]',
    '.layer-sheet__image',
    '.client-compare figure > div',
    '.figma-rail section',
    '.figma-preview > div'
  ].join(',')));

  let opener = null;

  const closeViewer = () => {
    if (!dialog.hasAttribute('open')) return;
    if (typeof dialog.close === 'function' && !dialog.classList.contains('is-fallback-open')) {
      dialog.close();
      return;
    }
    dialog.removeAttribute('open');
    dialog.classList.remove('is-fallback-open');
    document.body.classList.remove('has-image-viewer');
    viewerImage.removeAttribute('src');
    if (opener?.isConnected) opener.focus();
    opener = null;
  };

  sources.forEach((source) => {
    const image = source.querySelector('img');
    if (!image) return;

    source.classList.add('image-zoom-source');
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'image-zoom-button';
    button.setAttribute('aria-label', `View larger: ${image.alt || 'image detail'}`);
    button.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 4H4v5M15 4h5v5M9 20H4v-5M15 20h5v-5"/></svg>';
    button.addEventListener('click', () => {
      opener = button;
      viewerImage.src = image.currentSrc || image.src;
      viewerImage.alt = image.alt;
      viewerTitle.textContent = image.alt || 'Image detail';
      if (typeof dialog.showModal === 'function') {
        dialog.showModal();
      } else {
        dialog.setAttribute('open', '');
        dialog.classList.add('is-fallback-open');
        document.body.classList.add('has-image-viewer');
      }
      closeButton.focus();
    });
    source.append(button);
  });

  closeButton.addEventListener('click', closeViewer);
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) closeViewer();
  });
  dialog.addEventListener('close', () => {
    viewerImage.removeAttribute('src');
    if (opener?.isConnected) opener.focus();
    opener = null;
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && dialog.classList.contains('is-fallback-open')) closeViewer();
  });
})();
