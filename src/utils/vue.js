export function isVueReady(element) {
  return element && '__vue__' in element;
}
