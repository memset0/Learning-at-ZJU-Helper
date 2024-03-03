import logger from './utils/logger.js';
import { sleep } from './utils/global.js';
import { isVideoPage } from './utils/checker.js';
import { copyToClipboard } from './utils/browser.js';

class App {
  getNamespace() {
    const hostname = location.hostname;

    if (hostname === 'courses.zju.edu.cn') {
      return '学在浙大';
    } else if (hostname === 'classroom.zju.edu.cn' || hostname === 'livingroom.cmc.zju.edu.cn' || hostname === 'onlineroom.cmc.zju.edu.cn' || hostname === 'interactivemeta.cmc.zju.edu.cn') {
      return '智云课堂';
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
  }

  async load() {
    const context = {
      namespace: this.getNamespace(),
      logger,
      clipboard: {
        copy: copyToClipboard,
      },
      window: unsafeWindow,
      document: unsafeWindow.document,
      env: { isVideoPage: isVideoPage() },
    };
    const extendContext = (data) => {
      for (const key in data) {
        if (Object.keys(context).includes(key) && context[key] instanceof Object) {
          context[key] = { ...context[key], ...data[key] };
        } else {
          context[key] = data[key];
        }
      }
    };
    context.extendContext = extendContext;

    const isQueueCleaned = () => {
      for (const slug in this.plugins) {
        const plugin = this.plugins[slug];
        if (!plugin.loaded) return false;
      }
      return true;
    };

    logger.debug('开始加载插件', this.plugins);
    let retryTimes = 0;
    do {
      for (const slug in this.plugins) {
        const plugin = this.plugins[slug];
        if (!plugin.loaded) {
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
          if (plugin.skip instanceof Function) {
            if (await plugin.skip(context)) {
              plugin.loaded = true;
              plugin.skipped = true;
              logger.debug(`跳过加载 ${plugin.slug} 插件`);
              continue;
            }
          }
          if (plugin.check instanceof Function) {
            if (!(await plugin.check(context))) {
              continue;
            }
          }
          await plugin.load({
            ...context,
          });
          plugin.loaded = true;
        }
      }
      await sleep(100);
    } while (!isQueueCleaned() && ++retryTimes < 129);
    logger.info('插件加载完成!');
  }

  safe_load() {
    (async () => {
      try {
        await app.load(); // 这里需要 await，否则会捕获不到异常
      } catch (error) {
        logger.error(error);
        throw error;
      }
    })();
  }
}

const app = new App();
app.safe_load();
