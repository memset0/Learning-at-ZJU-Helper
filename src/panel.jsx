import '@ui5/webcomponents/dist/Card.js';
import '@ui5/webcomponents/dist/CardHeader.js';

import { createElement } from './utils/dom';

export function initializePanel(plugins) {
  require('./panel.less');

  const $panel = createElement(<div id="zju-helper" class="zju-helper"></div>);
  function togglePanel() {
    $panel.classList.toggle('visible');
  }
  function showPanel() {
    $panel.classList.add('visible');
  }
  function hidePanel() {
    $panel.classList.remove('visible');
  }

  const $trigger = createElement(<div class="zju-helper-trigger"></div>);

  // 注册panel出现和隐藏的事件
  $trigger.addEventListener('mouseenter', showPanel);
  $panel.addEventListener('mouseleave', hidePanel);
  // showPanel();

  document.body.appendChild($trigger);
  document.body.appendChild($panel);

  const pluginInitializers = {};
  Object.entries(plugins).forEach(([slug, plugin]) => {
    const initializer = () => {
      const $card = createElement(
        <ui5-card id={`zju-helper-plugin-${slug}`} class={`zju-helper-plugin zju-helper-plugin-${slug}`}>
          <ui5-card-header slot="header" title-text={plugin.name} subtitle-text={plugin.slug}></ui5-card-header>
        </ui5-card>
      );
      const $cardContent = createElement(<div class="zju-helper-plugin-content"></div>);
      $card.appendChild($cardContent);
      $panel.appendChild($card);
      return $cardContent;
    };
    pluginInitializers[slug] = initializer;
  });

  return {
    element: $panel,
    show: showPanel,
    hide: hidePanel,
    toggle: togglePanel,
    pluginInitializers,
  };
}
