import { isVueReady } from '../../utils/vue.js';

export const name = '[builtin]视频页面前置';
export const description = '内置插件，用于处理智云课堂的视频页面的播放器及相关内容。另外，将这一插件加入到其余模块的前置列表中，可以确保这些模块在播放器加载后再进行加载。';

export function skip({ env }) {
  return !env.isVideoPage;
}

function getElements({ document }) {
  const $course = document.querySelector('.living-page-wrapper');
  const $player = document.querySelector('#cmcPlayer_container');
  const $wrapper = document.querySelector('.living-page-wrapper .operate_wrap');

  if (!isVueReady($course) || !isVueReady($player) || !$wrapper) {
    return null;
  }

  return {
    course: $course,
    player: $player,
    wrapper: $wrapper,
    courseVue: $course.__vue__,
    playerVue: $player.__vue__,
  };
}

export function check({ document }) {
  // 检查能否从 document 中获取到播放器组件和对应的 Vue 实例。
  // 直到能够获取，才结束等待并正式加载本插件。
  return !!getElements({ document });
}

export function load({ logger, document, extendContext }) {
  require('./style.less');

  const elements = getElements({ document });
  logger.debug('视频页面元素:', elements);
  extendContext({ elements });

  const $wrapper = elements.wrapper;
  const $btn_group = document.createElement('div');
  $btn_group.className = 'mem-btn-group';
  $wrapper.insertBefore($btn_group, $wrapper.firstChild);
  logger.debug('wrapper', $wrapper);

  function addButton(key, text, callback) {
    const $btn = document.createElement('button');
    $btn.className = 'mem-btn mem-btn-primary';
    $btn.textContent = text;
    $btn.style = 'display: inline-block';
    $btn.setAttribute('data-key', key);

    $btn.onclick = () => {
      callback({
        element: $btn,
        setStatus: (status) => {
          logger.debug('(button)' + text, 'set status:', status);
          if (status) {
            $btn.innerText = text + '(' + status + ')';
          } else {
            $btn.innerText = text;
          }
        },
      });
    };

    for (const $current of $btn_group.children) {
      // 保持 data-key 有序
      if (Number($current.getAttribute('data-key')) > key) {
        $btn_group.insertBefore($btn, $current);
        return $btn;
      }
    }

    $btn_group.appendChild($btn);
    return $btn;
  }

  extendContext({ addButton });
}
