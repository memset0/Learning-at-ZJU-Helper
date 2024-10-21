import logger from './logger';

export function copyToClipboard(text) {
  const input = document.createElement('textarea');
  input.style.position = 'fixed';
  input.style.opacity = 0;
  input.value = text;
  document.body.appendChild(input);
  input.select();
  document.execCommand('copy');
  document.body.removeChild(input);
}

export async function printToPdf(options, html) {
  const { width, height, margin } = options;
  html = '<style> div.page { width: ' + (width - margin * 2) + 'px; height: ' + (height - margin * 2) + 'px; } </style>' + html;
  html = '<style> /* page settings */ @page { size: ' + width + 'px ' + height + 'px; margin: ' + margin + 'px; } </style>' + html;
  html = '<style> /* normalize browsers */ html, body { margin: 0 !important; padding: 0 !important; } </style>' + html;

  const { style } = options;
  if (style) {
    html += '\n\n\n<!-- additional style --><style>' + style + '</style>\n\n\n';
  }

  // const document = unsafeWindow.document;   // seemingly needless
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const blobUrl = URL.createObjectURL(blob);
  logger.debug('blobUrl:', blobUrl);

  const $iframe = document.createElement('iframe');
  $iframe.style.display = 'none';
  $iframe.src = blobUrl;
  document.body.appendChild($iframe);
  $iframe.onload = () => {
    setTimeout(() => {
      $iframe.focus();
      $iframe.contentWindow.print();
    }, 1);
  };
}

export function loadUrlQuery(search) {
  const query = {};
  search
    .slice(1)
    .split('&')
    .forEach((item) => {
      const [key, value] = item.split('=');
      query[key] = value;
    });
  return query;
}

export function dumpUrlQuery(query) {
  return (
    '?' +
    Object.entries(query)
      .map(([key, value]) => `${key}=${value}`)
      .join('&')
  );
}

export function showMessage(message) {
  alert(message);
}
