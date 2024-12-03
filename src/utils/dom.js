export function createHyperappElement(vnode) {
  const element = document.createElement(vnode.tag);

  for (const [key, value] of Object.entries(vnode.props || {})) {
    element.setAttribute(key, value);
  }

  vnode.children.forEach((child) => {
    if (typeof child === 'string') {
      element.appendChild(document.createTextNode(child));
    } else {
      element.appendChild(createElement(child));
    }
  });

  return element;
}

export const createElement = createHyperappElement;