export const name = '示例插件';
export const description = '这是一个示例插件，他不应该被加载到脚本中。';

export const required = []; // 前置要求：在列出的插件都被加载后才会加载，如果某个前置插件被跳过那么本插件也会跳过

export function skip() {
  // 是否需要跳过加载本插件：如果返回 false 或者本函数不存在则不跳过。
  return false;
}

export function check() {
  // 是否可以加载本插件：如果返回 true 或者本函数不存在则可以加载，否则等待下一轮直到返回 true 为止。
  // 注意：如果判定该插件不应该被加载，请在 skip() 方法中进行处理，而不是在 check() 方法中一直返回 false。
  return true;
}

export function load({ logger }) {
  // logger 是从上下文中继承来的，可以直接使用
  logger.debug('示例插件已被加载。'); // 使用这种方式输出的调试信息会附带插件名称等额外信息。
}
