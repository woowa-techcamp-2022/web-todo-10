import { serviceWorker } from '@/mocks/browser.js';

import './index.scss';
import Header from '@/components/Header';
import { makeTaskBoardElement } from '@/components/TaskBoard';

async function main() {
  if (process.env.NODE_ENV === 'development') {
    serviceWorker.start();
  }
  console.log(await fetch('/api/tasklists'));
  const $app = document.querySelector('#app');
  new Header($app);
  $app.append(makeTaskBoardElement());
}

main();
