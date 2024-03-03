export const name = '视频链接解析';
export const required = ['builtin-video-pages'];

export function load({ logger, clipboard, elements, addButton }) {
  // context.elements 是在 builtin-video-pages 插件中注入的

  function getUrl() {
    try {
      if (elements.playerVue.liveType === 'live') {
        return JSON.parse(elements.playerVue.liveUrl.replace('mutli-rate: ', ''))[0].url;
      } else {
        return document.querySelector('#cmc_player_video').src;
      }
    } catch (err) {
      // logger.error(err);
      return null;
    }
  }

  const $btn = addButton(0, '解析链接', () => {
    const url = getUrl();
    if (!url) {
      alert('获取视频地址失败，请待播放器完全加载后再试。');
      return;
    }
    logger.info('视频链接:', url);
    clipboard.copy(url);
    $btn.innerText = '解析链接(已拷贝)';
    setTimeout(() => {
      $btn.innerText = '解析链接';
    }, 500);
  });
}
