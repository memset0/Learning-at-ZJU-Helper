import { sleep } from '../../utils/global';

export const name = '更好的 PTA';

function getUrl() {
  return location.href + location.hash;
}

export function skip({ namespace }) {
  return namespace !== 'PTA';
}

export function load({ logger, clipboard }) {
  async function render() {
    function getPlain($target) {
      const $wrapper = document.createElement('div');
      $wrapper.appendChild($target.cloneNode(true));
      function convert($e) {
        if ($e.tagName === 'LABEL') {
          return '- ' + $e.innerHTML + '\n\n'; // 题目选项
        }
        if ($e.className === 'pc-text-raw') {
          return $e.innerHTML + ' '; // 题目选项
        }
        if ($e.className === 'katex-html' || $e.tagName === 'mrow') {
          return ''; // 过滤掉 latex 中的重复部分
        }
        if ($e.className === 'katex') {
          return '$' + $e.innerHTML + '$'; // latex 支持
        }
        if ($e.tagName === 'IMG') {
          return `![${$e.alt || ''}](${$e.src})`; // 图片支持
        }
        if ($e.tagName === 'PRE') {
          return '```\n' + $e.innerHTML + '\n```\n'; // 代码
        }
        if ($e.tagName === 'P') {
          return $e.innerHTML + '\n\n'; // 换行支持
        }
        return $e.innerHTML;
      }
      function flatNode($e) {
        while ($e.children.length > 0) {
          flatNode($e.children[0]);
        }
        // logger.debug('flat', $e.tagName, $e.className, convert($e), $e);
        $e.outerHTML = convert($e);
      }
      flatNode($wrapper.children[0]);
      return $wrapper.innerHTML
        .replace(/\n{2,}/g, '\n\n')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .replace(/&nbsp;/g, ' ')
        .replace(/&quot;/g, '"')
        .replace(/&apos;/g, "'");
    }

    function createButton($target) {
      const $btn = document.createElement('button');
      $btn.classList.add('mem-pta-btn');
      $btn.innerText = '复制文本';
      $btn.onclick = () => {
        $btn.innerText = '已复制';
        setTimeout(() => {
          $btn.innerText = '复制文本';
        }, 500);
        const plain = getPlain($target);
        clipboard.copy(plain);
        logger.debug('plain text:', plain);
      };
      return $btn;
    }

    function renderUpsolvingProblem($e) {
      $e.children[0].appendChild(createButton($e.children[1]));
    }
    function renderExamProblem($e) {
      $e.children[0].children[0].appendChild(createButton($e.children[1]));
    }

    Array.from(document.querySelectorAll('.pc-x:not(.mem-pta-rendered)')).filter(($e) => {
      if (!$e.id) return false;
      logger.debug($e.id);
      $e.classList.add('mem-pta-rendered');
      renderExamProblem($e);
      return true;
    });
    Array.from(document.querySelectorAll('.p-4:not(.mem-pta-rendered)')).filter(($e) => {
      if (!$e.children || !$e.children.length || $e.children[0].innerText.trim() != '题目描述') return false;
      logger.debug($e);
      $e.classList.add('mem-pta-rendered');
      renderUpsolvingProblem($e);
      return true;
    });
  }

  const max_times = 20;
  let times = max_times;

  document.addEventListener(
    'click',
    (event) => {
      if (times < 5) times = 5;
    },
    true // 将第三个参数设定为 true，确保在点击已绑定 click listener 的元素上也起作用
  );

  (async () => {
    let url = getUrl();
    while (true) {
      await sleep(100);
      // logger.debug('tracking... times =', times);
      if (getUrl() !== url) {
        url = getUrl();
        times = max_times;
      }
      if (times > 0) {
        --times;
        await render();
      }
    }
  })();
}
