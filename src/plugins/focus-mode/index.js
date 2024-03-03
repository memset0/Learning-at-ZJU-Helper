export const name = '专注模式';

export function load({ logger, namespace }) {
  if (namespace === '学在浙大') {
    require('./xzzd.less');
  } else if (namespace === '智云课堂') {
    require('./zykt.less');
  } else {
    logger.debug('没有可以加载的样式.');
  }
}
