export const name = 'builtin-video-pages';
export const fullname = '[builtin]视频页面前置';

export function skip({ env }) {
  return !env.isVideoPage;
}

function isVueReady(elem) {
  return elem !== null && '__vue__' in elem;
}

function getElements() {
  const $course = document.querySelector('.living-page-wrapper');
  const $player = document.querySelector('#cmcPlayer_container');

  if (!isVueReady($course) || !isVueReady($player)) {
    return null;
  }

  return {
    course: $course,
    player: $player,
    courseVue: $course.__vue__,
    playerVue: $player.__vue__,
  };
}

export function check() {
  return !!getElements();
}

export function load({ extendContext }) {
  extendContext({ el: getElements() });
}
