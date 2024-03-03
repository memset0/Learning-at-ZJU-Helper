export const name = '示例插件';
export const description = '这是一个示例插件，他不应该被加载到脚本中。';

export const required = []; // 前置要求：在列出的插件都被加载后才会加载，如果某个前置插件被跳过那么本插件也会跳过

export function skip() {
  // 是否需要跳过加载本插件：如果返回 false 或者本函数不存在则不跳过
  return false;
}

export function check() {
  // 是否可以加载本插件：如果返回 true 或者本函数不存在则可以加载，否则等待下一轮
  return true;
}

export function load({ logger }) {
  // logger 是从上下文中继承来的，可以直接使用
  logger.debug('示例插件已被加载。');
}
