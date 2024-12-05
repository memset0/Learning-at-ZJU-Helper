export const name = '智云回放链接解析';
export const required = ['builtin-video-pages'];
export const namespace = '智云课堂';

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

  addButton(2, '解析链接', ({ setStatus }) => {
    const url = getUrl();
    if (!url) {
      alert('获取视频地址失败，请待播放器完全加载后再试。');
      return;
    }
    logger.info('视频链接:', url);
    clipboard.copy(url);
    setStatus('已拷贝');
    setTimeout(() => {
      setStatus(null);
    }, 500);
  });
}
