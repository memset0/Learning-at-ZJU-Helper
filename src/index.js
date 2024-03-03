import logger from './utils/logger.js';
import { sleep } from './utils/global.js';
import { isVideoPage } from './utils/checker.js';

class App {
  _load_plugins() {
    const pluginList = [require('./plugins/builtin-video-pages/index.js'), require('./plugins/focus-mode/index.js'), require('./plugins/download-video/index.js')];
    const plugins = {};
    for (const plugin of pluginList) {
      plugins[plugin.name] = plugin;
    }
    return plugins;
  }

  constructor() {
    this.plugins = this._load_plugins();
  }

  async load() {
    const context = {
      logger,
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
      for (const pluginName in this.plugins) {
        const plugin = this.plugins[pluginName];
        if (!plugin.loaded) return false;
      }
      return true;
    };
    logger.debug('开始加载插件', this.plugins);
    do {
      for (const pluginName in this.plugins) {
        const plugin = this.plugins[pluginName];
        if (!plugin.loaded) {
          if (plugin.skip instanceof Function) {
            if (plugin.skip(context)) {
              plugin.loaded = true;
              plugin.skipped = true;
              logger.debug(`跳过加载 ${plugin.name} 插件`);
              continue;
            }
          }
          if (plugin.check instanceof Function) {
            if (!plugin.check(context)) {
              continue;
            }
          }
          if (plugin.required && plugin.required instanceof Array && plugin.required.length > 0) {
            let status = 'ok';
            for (const required of plugin.required) {
              console.log(required);
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
              logger.debug(`跳过加载 ${plugin.name} 插件，因为他的前置插件被跳过`);
              continue;
            } else if (status === 'wait') {
              continue;
            }
          }
          plugin.load({
            ...context,
          });
          plugin.loaded = true;
        }
      }
      await sleep(100);
    } while (!isQueueCleaned());
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
