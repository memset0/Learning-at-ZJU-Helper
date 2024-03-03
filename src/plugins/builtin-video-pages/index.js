import { isVueReady } from '../../utils/vue.js';

export const name = '[builtin]视频页面前置';

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
  return !!getElements({ document });
}

export function load({ logger, document, extendContext }) {
  require('./style.less');

  const elements = getElements({ document });
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
    $btn.onclick = callback;
    $btn.setAttribute('data-key', key);

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
