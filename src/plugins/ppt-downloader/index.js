import { saveAs } from 'file-saver';
import { limitConcurrency } from '../../utils/global';
import { printToPdf } from '../../utils/browser.js';

export const name = '课件下载';
export const required = ['builtin-video-pages'];
export const namespace = '智云课堂';

export const options = {
  'auto-remove': true,
};

function getPPTList(elements) {
  return Array.from(elements.courseVue.$data.pptList);
}

function autoRemoveFilter(pptList) {
  const result = [];
  for (let i = 0; i < pptList.length; i++) {
    if (i + 1 < pptList.length && pptList[i + 1].switchTime === pptList[i].switchTime) {
      // 删除来自同一秒钟的PPT
      continue;
    }
    result.push(pptList[i]);
  }
  return result;
}

export function check({ elements }) {
  return getPPTList(elements).length > 0;
}

export function load({ logger, elements, addButton, loadScript }, options) {
  let pptList = getPPTList(elements)
    .map((item) => {
      // Convert vue object to normal object
      return {
        ...item,
        ppt: { ...item.ppt },
      };
    })
    .map((ppt) => {
      ppt.imgSrc = ppt.imgSrc.replace('http://', 'https://');
      ppt.s_imgSrc = ppt.s_imgSrc.replace('http://', 'https://');
      return ppt;
    });
  logger.debug(`PPT下载(共${pptList.length}个):`, pptList[0]);

  if (true) {
    // if (options.get("auto-remove")) {
    pptList = autoRemoveFilter(pptList);
    logger.debug(`删除同一秒内的PPT后(共${pptList.length}个):`, pptList[0]);
  }

  addButton(1.1, '打包下载', async ({ setStatus }) => {
    setStatus('加载JSZip库');
    loadScript('jszip.min.js');
    const zip = new JSZip();

    let counter = 0;
    let total = pptList.length;
    await limitConcurrency(
      pptList.map(async (ppt, index) => {
        const filename = `ppt-${String(index).padStart(4, '0')}-${ppt.switchTime.replace(/\:/g, '-')}.jpg`;
        const res = await fetch(ppt.imgSrc, { method: 'GET' });
        const blob = await res.blob();
        logger.debug('添加图片', filename, blob);
        setStatus(`正在下载(${++counter}/${total})`);
        zip.file(filename, blob, { binary: true });
      }),
      8
    );

    setStatus('生成Zip');
    logger.debug(zip);
    const content = await zip.generateAsync({ type: 'blob' });
    logger.debug('完成生成zip', content);

    setStatus('完成');
    saveAs(content, 'ppt.zip');
    setStatus(null);
  });

  addButton(1.2, '导出为PDF', async ({ setStatus }) => {
    let html = '';
    let counter = 0;
    let total = pptList.length;
    const imageList = await limitConcurrency(
      pptList.map(async (ppt, index) => {
        const res = await fetch(ppt.imgSrc, { method: 'GET' });
        setStatus(`正在下载(${++counter}/${total})`);
        const blob = await res.blob();
        const blobUrl = URL.createObjectURL(blob);
        logger.log(index, blobUrl);
        return blobUrl;
      }),
      8
    );

    setStatus('生成PDF中');
    for (const image of imageList) {
      html += `<div class="page"><img src="${image}" /></div>`;
    }

    await printToPdf(
      {
        width: 1280,
        height: 720,
        margin: 0,
      },
      html
    );

    setStatus(null);
  });
}
