import { isVideoPage } from './utils/checker.js';

class App {
  constructor() {
    this.plugins = [require('./plugins/focus-mode/index.js')];
  }

  run() {
    const context = {
      env: {
        isVideoPage: isVideoPage(),
      },
    };

    const queue = this.plugins;
    const isQueueCleaned = () => {
      for (const plugin of queue) {
        if (!plugin.loaded) return false;
      }
      return true;
    };
    do {
      for (const plugin of queue) {
        if (!plugin.loaded) {
          plugin.run({
            ...context,
          });
          plugin.loaded = true;
        }
      }
    } while (!isQueueCleaned());
    console.log('Loaded All!');
  }
}

const app = new App();
app.run();
