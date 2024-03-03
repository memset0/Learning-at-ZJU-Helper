export async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function limitConcurrency(tasks, limit) {
  return new Promise((resolve, reject) => {
    let active = 0;
    let finished = 0;
    let started = 0;
    let results = [];

    function startNext() {
      console.log('!! ', finished, tasks.length);
      if (finished >= tasks.length) {
        resolve(results);
        return;
      }

      while (started < tasks.length && active < limit) {
        let currentPos = started;
        let p = tasks[started];

        p.then((result) => {
          active--;
          finished++;
          results[currentPos] = result;
          startNext();
        }).catch((err) => {
          reject(err);
        });

        active++;
        started++;
      }
    }

    startNext();
  });
}
