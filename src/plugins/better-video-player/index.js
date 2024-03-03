import { sleep } from '../../utils/global.js';

export const name = '更好的视频播放器';
export const required = ['builtin-video-pages'];

function getWrapper(document) {
  const $wrapper = document.querySelector('.control-bottom .control-right');
  if (!$wrapper) {
    return null;
  }
  if (!$wrapper.children || $wrapper.children.length === 0) {
    return null;
  }
  return $wrapper;
}

export function check({ document }) {
  return !!getWrapper(document);
}

export async function load({ logger, document, elements, addButton }) {
  require('./style.less');

  async function toggle() {
    document.body.classList.toggle('better-video-player');
    await sleep(100);
    elements.playerVue.resizePlayer();
  }

  const $wrapper = getWrapper(document);

  const $button = document.createElement('div');
  $button.className = 'mem-bvp-btn';
  $button.innerText = '网页全屏';
  $button.onclick = () => toggle();
  $wrapper.insertBefore($button, $wrapper.firstChild);
  logger.debug('wrapper', $wrapper, $button);
}
