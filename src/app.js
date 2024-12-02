import { initializePanel } from './panel.js';

import logger from './utils/logger.js';
import { isVideoPage } from './utils/checker.js';
import { copyToClipboard } from './utils/browser.js';
import { sleep, matchRoute } from './utils/global.js';

class App {
  getNamespace() {
    const hostname = location.hostname;

    if (hostname === 'courses.zju.edu.cn') {
      return '学在浙大';
    }
    if (hostname === 'classroom.zju.edu.cn' || hostname === 'livingroom.cmc.zju.edu.cn' || hostname === 'onlineroom.cmc.zju.edu.cn' || hostname === 'interactivemeta.cmc.zju.edu.cn') {
      return '智云课堂';
    }
    if (hostname === 'pintia.cn') {
      return 'PTA';
    }
    return null;
  }

  loadScript(link) {
    if (this.loadedScripts.includes(link)) {
      return;
    }
    this.loadedScripts.push(link);
    logger.debug(link, GM_getResourceText);
    const script = GM_getResourceText(link);
    if (script === null) {
      logger.error(`脚本 ${link} 加载失败`);
    } else {
      logger.debug(script);
      unsafeWindow.eval(script);
    }
  }

  constructor() {
    this.plugins = {};
    const pluginLoader = require.context('./plugins', true, /\/index\.js$/);
    pluginLoader.keys().forEach((filename) => {
      const slug = filename.slice(2, -9);
      if (slug === 'example-plugin') {
        return; // 示例插件将不会被加载
      }
      this.plugins[slug] = pluginLoader(filename);
      this.plugins[slug].slug = slug;
    });

    this.loadedScripts = [];
  }

  async load() {
    // 初始化面板
    const panel = initializePanel();

    // 上下文管理
    const context = {
      panel,
      namespace: this.getNamespace(),
      clipboard: {
        copy: copyToClipboard,
      },
      window: unsafeWindow,
      document: unsafeWindow.document,
      location: unsafeWindow.location,
      env: { isVideoPage: isVideoPage() },
      loadScript: (link) => this.loadScript(link),
    };

    // 检查插件队列是否已经清空
    const isQueueCleaned = () => {
      for (const slug in this.plugins) {
        const plugin = this.plugins[slug];
        if (!plugin.loaded) {
          return false;
        }
      }
      return true;
    };

    logger.debug('开始加载插件', this.plugins);
    let retryTimes = 0;
    do {
      for (const slug in this.plugins) {
        const plugin = this.plugins[slug];
        if (!plugin.loaded) {
          // 合成插件上下文
          const pluginContext = {
            ...context,
            logger: logger.extends(plugin.slug),
          };

          // 检测插件前置列表
          if (plugin.required && plugin.required instanceof Array && plugin.required.length > 0) {
            let status = 'ok';
            for (const required of plugin.required) {
              if (this.plugins[required].skipped) {
                status = 'skip';
                break;
              } else if (!this.plugins[required].loaded) {
                status = 'wait';
                break;
              }
            }
            if (status === 'skip') {
              plugin.loaded = true;
              plugin.skipped = true;
              logger.debug(`跳过加载 ${plugin.slug} 插件，因为前置插件被跳过`);
              continue;
            } else if (status === 'wait') {
              continue;
            }
          }

          // 检查该插件是否需要跳过
          let needSkip = false;
          if (!needSkip && plugin.namespace) {
            if (plugin.namespace instanceof Array) {
              if (!plugin.namespace.includes(context.namespace)) {
                needSkip = true;
              }
            } else if (plugin.namespace !== context.namespace) {
              needSkip = true;
            }
          }
          if (!needSkip && plugin.route) {
            if (matchRoute(plugin.route, location.pathname) === false) {
              needSkip = true;
            }
          }
          if (!needSkip && plugin.skip instanceof Function) {
            if (await plugin.skip(pluginContext)) {
              needSkip = true;
            }
          }
          if (needSkip) {
            plugin.loaded = true;
            plugin.skipped = true;
            logger.debug(`跳过加载 ${plugin.slug} 插件`);
            continue;
          }

          // 检查该插件是否可以加载
          if (plugin.check instanceof Function) {
            if (!(await plugin.check(pluginContext))) {
              continue;
            }
          }

          if (plugin.route) {
            const params = matchRoute(plugin.route, location.pathname);
            pluginContext.params = params;
          }
          // 进行插件加载
          await plugin.load(pluginContext);
          plugin.loaded = true;
        }
      }

      // 等待 100ms 后进行下一轮检查，避免阻塞渲染进程
      await sleep(100);
    } while (!isQueueCleaned() && ++retryTimes < 129);

    if (!isQueueCleaned()) {
      logger.error(
        '插件加载失败，还有以下插件未加载:',
        Object.keys(this.plugins).filter((slug) => !this.plugins[slug].loaded)
      );
    } else {
      logger.info('插件加载完成!');
    }
  }

  safe_load() {
    (async () => {
      try {
        await app.load(); // 这里需要 await，否则捕获不到异常
      } catch (error) {
        logger.error(error);
        throw error;
      }
    })();
  }
}

const app = new App();
app.safe_load();
