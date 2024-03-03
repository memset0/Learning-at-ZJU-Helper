export const name = 'download-video';
export const fullname = '视频下载';
export const required = ['builtin-video-pages'];

export function load({ logger, el }) {
  logger.debug('视频下载');
  logger.log(el);

  function getUrl() {
    try {
      if (el.playerVue.liveType === 'live') {
        return JSON.parse(el.playerVue.liveUrl.replace('mutli-rate: ', ''))[0].url;
      } else {
        return document.querySelector('#cmc_player_video').src;
      }
    } catch (err) {
      // logger.error(err);
      return '获取视频地址失败，请待播放器完全加载后再试。';
    }
  }

  logger.log(getUrl());
}
