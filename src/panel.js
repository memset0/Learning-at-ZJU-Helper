import '@ui5/webcomponents/dist/BusyIndicator.js';

export function initializePanel() {
  require('./panel.less');

  const $panel = document.createElement('div');
  $panel.id = 'zju-helper';
  $panel.classList.add('zju-helper');

  function togglePanel() {
    $panel.classList.toggle('visible');
  }
  function showPanel() {
    $panel.classList.add('visible');
  }
  function hidePanel() {
    $panel.classList.remove('visible');
  }

  const $trigger = document.createElement('div');
  $trigger.classList.add('zju-helper-trigger');

  $trigger.addEventListener('mouseenter', showPanel);
  $panel.addEventListener('mouseleave', hidePanel);

  document.body.appendChild($trigger);
  document.body.appendChild($panel);

  const panel = {
    element: $panel,
    show: showPanel,
    hide: hidePanel,
    toggle: togglePanel,
  };

	const $busyIndicator = document.createElement('ui5-busy-indicator');
  $busyIndicator.setAttribute('size', 'M');
  $busyIndicator.setAttribute('active', '');
  $panel.appendChild($busyIndicator);

  return panel;
}
