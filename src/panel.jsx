import '@ui5/webcomponents/dist/Card.js';
import '@ui5/webcomponents/dist/CardHeader.js';
import '@ui5/webcomponents/dist/Tag.js';

import { app } from 'hyperapp';

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
      const $pluginRoot = createElement(<div></div>);
      $cardContent.appendChild($pluginRoot);
      $card.appendChild($cardContent);
      $panel.appendChild($card);

      // 检测是否存在滚动条，用于实现动画效果
      const observer = new ResizeObserver(() => {
        if ($cardContent.scrollHeight > $cardContent.clientHeight) {
          $cardContent.classList.add('has-overflow');
        } else {
          $cardContent.classList.remove('has-overflow');
        }
      });
      observer.observe($pluginRoot);

      return $pluginRoot;
    };
    pluginInitializers[slug] = initializer;
  });

  const $panelHeader = createElement(<div></div>);
  $panel.appendChild($panelHeader);
  function getPluginColorScheme(plugin) {
    if (plugin.slug.startsWith('builtin-')) {
      return 8;
    }
    if (plugin.namespace === '学在浙大') {
      return 4;
    }
    if (plugin.namespace === '智云课堂') {
      return 5;
    }
    if (plugin.namespace === 'PTA') {
      return 6;
    }
    return 10;
  }
  const panelHeaderDispatch = app({
    node: $panelHeader,
    init: { loadedPlugins: [] },
    view: ({ loadedPlugins }) => (
      <ui5-card>
        <div class="zju-helper-panel-header">
          <div class="zju-helper-panel-header-title">学在浙大/智云课堂小助手</div>
          <div class="zju-helper-loaded-plugins-slogen">当前共加载 {loadedPlugins.length} 个插件</div>
          <div class="zju-helper-loaded-plugins">
            {loadedPlugins.map((plugin) => (
              <a //
                class="zju-helper-loaded-plugin-tag"
                target="_blank"
                href={`https://github.com/memset0/Learning-at-ZJU-Helper/tree/master/src/plugins/${plugin.slug}`}
              >
                <ui5-tag design="Set2" color-scheme={getPluginColorScheme(plugin)}>
                  {plugin.slug}
                </ui5-tag>
              </a>
            ))}
          </div>
        </div>
      </ui5-card>
    ),
  });
  function pushLoadedPlugin(newPlugin) {
    panelHeaderDispatch((state) => {
      state.loadedPlugins.push(newPlugin);
      return { ...state };
    });
  }

  return {
    element: $panel,
    show: showPanel,
    hide: hidePanel,
    toggle: togglePanel,
    pluginInitializers,
    pushLoadedPlugin,
  };
}
