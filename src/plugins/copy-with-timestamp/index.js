import { copyToClipboard, showMessage, loadUrlQuery, dumpUrlQuery } from '../../utils/browser.js';

export const name = '带时间戳的地址复制（精准空降）';
export const required = ['builtin-video-pages'];
export const namespace = '智云课堂';

function getWrapper(document) {
  const $wrapper = document.querySelector('.control-bottom .control-right');
  if (!$wrapper || !$wrapper.children || $wrapper.children.length === 0) {
    return null;
  }
  return $wrapper;
}

export function check({ document }) {
  return !!getWrapper(document);
}

export async function load({ logger, document, elements }) {
  async function copyLinkWithTimestamp() {
    const url = document.location.origin + document.location.pathname;
    const query = loadUrlQuery(document.location.search) || {};
    query.ts = Math.floor(elements.playerVue.getPlayTime());

    const finalUrl = url + dumpUrlQuery(query);
    copyToClipboard(finalUrl);
    showMessage('复制成功！');
  }

  const query = loadUrlQuery(document.location.search) || {};
  if (query.ts) {
    try {
      logger.info('需定位到对应时间戳');
      logger.log('player', elements.playerVue);
      logger.log('playTime', elements.playerVue.getPlayTime());
      elements.playerVue.setPlayerPlayTime(query.ts);
      logger.log('playTime', elements.playerVue.getPlayTime());
    } catch (e) {
      logger.error('定位失败', e);
    }
  }

  const $wrapper = getWrapper(document);

  const $button = document.createElement('div');
  $button.className = 'mem-bvp-btn';
  $button.innerText = '复制地址(精准空降)';
  $button.onclick = () => copyLinkWithTimestamp();
  $wrapper.insertBefore($button, $wrapper.firstChild);
}
