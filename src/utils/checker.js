export function isVideoPage() {
  if (location.host === 'classroom.zju.edu.cn' && location.pathname === '/livingroom') {
    return true;
  }
  if (location.host === 'interactivemeta.cmc.zju.edu.cn' && location.pathname === '/' && location.hash.startsWith('#/replay?')) {
    return true;
  }
  return false;
}
