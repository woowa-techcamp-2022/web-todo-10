import { serviceWorker } from '@/mocks/browser.js';
import './index.scss';
import { makeHeaderElement } from './components/Header';
import { makeTaskBoardElement } from '@/components/TaskBoard';
import request from './util/fetchUtil.js';
import { makeLogMenuElement } from './components/LogMenu';

async function main() {
  if (process.env.NODE_ENV === 'development') {
    console.log('hi', process.env.NODE_ENV);
    serviceWorker.start();
  }
  console.log(process.env.NODE_ENV);

  const $app = document.querySelector('#app');
  const taskListDatas = await request.allLists();
  $app.append(makeHeaderElement());
  $app.append(makeLogMenuElement());
  $app.append(makeTaskBoardElement(taskListDatas));
}

main();

const activateElement = ($header) => {
  const $menuBtn = $header.querySelector('.header__menu-btn');
  $menuBtn.addEventListener('click', openLogMenu);
};

const openLogMenu = async () => {
  const logData = await request.getLog();
  document.body.append(makeLogMenuElement(logData));
};
