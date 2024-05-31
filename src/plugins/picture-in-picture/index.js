import { sleep } from '../../utils/global.js';

export const name = '播放器画中画';
export const required = ['builtin-video-pages'];

function getVideoWrapper(document) {
  const $wrapper = document.querySelector('.control-bottom .control-right');
  if (!$wrapper) {
    return null;
  }
  if (!$wrapper.children || $wrapper.children.length === 0) {
    return null;
  }
  return $wrapper;
}

function getPPTWrapper(document) {
  const $wrapper = document.querySelector('.opr_lay .ppt_opr_lay');
  if (!$wrapper) {
    return null;
  }
  if (!$wrapper.children || $wrapper.children.length === 0) {
    return null;
  }
  return $wrapper;
}

function getHook(document) {
  const $wrapper = document.querySelector('.change-item');
  if (!$wrapper) {
    return null;
  }
  if (!$wrapper.children || $wrapper.children.length === 0) {
    return null;
  }
  return $wrapper;
}

function createButton() {
  const $button = document.createElement('div');
  $button.className = 'pip-btn';
  $button.innerHTML = '<svg class="svg-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path d="M38 14H22v12h16V14zm4-8H6c-2.21 0-4 1.79-4 4v28c0 2.21 1.79 3.96 4 3.96h36c2.21 0 4-1.76 4-3.96V10c0-2.21-1.79-4-4-4zm0 32.03H6V9.97h36v28.06z"></path></svg>'
  return $button;
}

async function openPIP() {
  if (documentPictureInPicture.window) {
    documentPictureInPicture.window.close();
    return;
  }

  // Open a Picture-in-Picture window.
  const pipWindow = await documentPictureInPicture.requestWindow({
    width: 640,
    height: 360,
  });

  // Copy all style sheets.
  [...document.styleSheets].forEach((styleSheet) => {
    try {
      const cssRules = [...styleSheet.cssRules].map((rule) => rule.cssText).join('');
      const style = document.createElement('style');

      style.textContent = cssRules;
      pipWindow.document.head.appendChild(style);
    } catch (e) {
      const link = document.createElement('link');

      link.rel = 'stylesheet';
      link.type = styleSheet.type;
      link.media = styleSheet.media;
      link.href = styleSheet.href;
      pipWindow.document.head.appendChild(link);
    }
  });

  return pipWindow;
}

export function check({ document }) {
  let PIP = false;

  if ('documentPictureInPicture' in window) {
    // The Document Picture-in-Picture API is supported.
    PIP = true;
  } else {
    logger.debug('PIP api not supported');
  }

  return PIP && (!!getVideoWrapper(document)) && (!!getPPTWrapper(document)) && (!!getHook(document));
}

export async function load({ logger, document, elements, addButton }) {
  require('./style.less');

  const $videoWrapper = getVideoWrapper(document);
  const $videoBtn = createButton();
  $videoBtn.onclick = () => {
    // Native handle
    document.querySelector("#cmc_player_video").requestPictureInPicture();
  }
  $videoWrapper.insertBefore($videoBtn, $videoWrapper.lastChild);

  let flag = false;
  let pip = null;

  // PPT View Handle
  const $hook = getHook(document);
  $hook.onclick = async () => {
    if (flag) {
      flag = false;
      return;
    }
    flag = true;

    await sleep(100);

    const $pptWrapper = getPPTWrapper(document);
    const $pptBtn = createButton();

    $pptBtn.onclick = async () => {
      pip = openPIP();

      // Hook vue for document query
      const pptVue = document.querySelector(".main_resize_con .ppt_container").__vue__;
      const pptCanvas = document.querySelector("#ppt_canvas");
      pptVue.drawImg = function (t) {
        var e = pptVue
          , i = pptCanvas
          , n = new Image;
        n.crossOrigin = "anonymous",
          n.onload = () => (function (elem) {
            var t = n.width
              , s = n.height
              , a = elem.offsetWidth
              , r = elem.offsetHeight
              , o = i.getContext("2d")
              , l = t / s
              , c = a / r
              , u = 0
              , d = 0;
            l > c ? d = (r - (s = (t = a) / l)) / 2 : u = (a - (t = (s = r) * l)) / 2,
              console.log("imgW=", t, "imgH=", s, "imgRatio=", l, "csvRatio=", c, "drawPosY=", d, "drawPosX=", u),
              i.setAttribute("width", a),
              i.setAttribute("height", r),
              o.drawImage(n, u, d, t, s);
            var p = o.getImageData(0, 0, a, r);
            e.middleAry = [p]
          })(i)
          ,
          n.src = t
      }

      // Drag is broken, just clean evt to clean error
      const dragWrapperVue = document.querySelector(".el-slider__button-wrapper").__vue__;
      const dragVue = document.querySelector(".el-slider__button").__vue__;
      let dragCache = {};
      dragCache.onDragStart = dragWrapperVue.onDragStart;
      dragWrapperVue.onDragStart = function () { };
      dragCache.onDragging = dragWrapperVue.onDragging;
      dragWrapperVue.onDragging = function () { };
      dragCache.onDragEnd = dragWrapperVue.onDragEnd;
      dragWrapperVue.onDragEnd = function () { };
      dragCache.updatePopper = dragVue.updatePopper;
      dragVue.updatePopper = function () { };

      pip = await pip;
      getHook(document).style.display = "none";


      const ppt = document.querySelector(".main_resize_con").firstElementChild;
      pip.document.body.className = 'pip-window';
      pip.document.body.append(ppt);

      // Listen for the PiP closing event to move the video back.
      pip.addEventListener("pagehide", (event) => {
        const container = document.querySelector(".main_resize_con");
        const elem = event.target.body.lastChild;

        // This is very strange, if you directly pip.close(), evt will fire, but elem has gone. maybe vue unmounted?
        if (elem) {
          container.append(elem);

          // Retrieve
          dragWrapperVue.onDragStart = dragCache.onDragStart;
          dragWrapperVue.onDragging = dragCache.onDragging;
          dragWrapperVue.onDragEnd = dragCache.onDragEnd;
          dragVue.updatePopper = dragCache.updatePopper;

          pptVue.drawImg = function (t) {
            var e = this
              , i = document.getElementById("ppt_canvas")
              , n = new Image;
            n.crossOrigin = "anonymous",
              n.onload = function () {
                var t = n.width
                  , s = n.height
                  , a = document.getElementById("ppt").offsetWidth
                  , r = document.getElementById("ppt").offsetHeight
                  , o = i.getContext("2d")
                  , l = t / s
                  , c = a / r
                  , u = 0
                  , d = 0;
                l > c ? d = (r - (s = (t = a) / l)) / 2 : u = (a - (t = (s = r) * l)) / 2,
                  console.log("imgW=", t, "imgH=", s, "imgRatio=", l, "csvRatio=", c, "drawPosY=", d, "drawPosX=", u),
                  i.setAttribute("width", a),
                  i.setAttribute("height", r),
                  o.drawImage(n, u, d, t, s);
                var p = o.getImageData(0, 0, a, r);
                e.middleAry = [p]
              }
              ,
              n.src = t
          };

          getHook(document).style.display = "block";
        } else {
          // create elem manually not working, maybe a racing condition?
          // just hidden the btn to solve it.

          // let e = container.createElement("div");
          // e.className = "ppt_container"
          // e = e.createElement("div");
          // e.className = "ppt_img_con";
          // e = e.createElement("canvas");
          // e.className = "ppt_canvas";
          // e.id = "ppt_canvas";
        }
      });
    };

    $pptWrapper.insertBefore($pptBtn, null);
  }
}
