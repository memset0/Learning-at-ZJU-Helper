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

export function matchRoute(route, pathname) {
  const paramTypes = [];
  const paramNames = [];
  let paramMatch;
  const paramRegex = /<([^>:]+)(?::([^>]+))?>/g;
  while ((paramMatch = paramRegex.exec(route)) !== null) {
    const name = paramMatch[1];
    const type = paramMatch[2] || 'string';
    paramTypes.push(type);
    paramNames.push(name);
  }

  const pattern = route.replace(/<([^>:]+)(?::([^>]+))?>/g, '([^/]+)');
  const regex = new RegExp(`^${pattern}$`);

  const match = pathname.match(regex);
  if (!match) {
    return false;
  }

  const result = {};
  for (let i = 0; i < paramNames.length; i++) {
    const value = match[i + 1];
    const type = paramTypes[i];

    if (type === 'int') {
      if (!/^\d+$/.test(value)) {
        return false;
      }
      result[paramNames[i]] = parseInt(value);
    } else if (type === 'string') {
      result[paramNames[i]] = value;
    } else {
      return false;
    }
  }

  return result;
}
