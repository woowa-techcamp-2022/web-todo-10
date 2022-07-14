import './index.scss';
import request from '@util/fetchUtil';
import { makeLogMenuItemElement } from './LogMenuItem';

export const makeLogMenuElement = () => {
  const $logMenu = document.createElement('div');
  $logMenu.className = 'log-menu';
  $logMenu.innerHTML = getInnerTemplate();
  activateElement($logMenu);
  return $logMenu;
};

const getInnerTemplate = () => {
  const openBtnTemplate = getOpenBtnTemplate();
  const logListTemplate = getListTemplate();
  return openBtnTemplate + logListTemplate;
};

const getOpenBtnTemplate = () => {
  return `<button class='log-menu__btn log-menu__btn--open'></button>`;
};

const getListTemplate = () => {
  return `
    <div class='log-container closed'>
      <button class='log-menu__btn log-menu__btn--close'></button>
      <ul class='log-items'></ul>
    </div>
  `;
};

const activateElement = ($logMenu) => {
  const $openBtn = $logMenu.querySelector('.log-menu__btn--open');
  const $closeBtn = $logMenu.querySelector('.log-menu__btn--close');
  $openBtn.addEventListener('click', openMenu.bind(null, $logMenu));
  $closeBtn.addEventListener('click', closeMenu.bind(null, $logMenu));
};

const openMenu = ($logMenu) => {
  const $logContainer = $logMenu.querySelector('.log-container');
  updateLogItems($logMenu);
  $logContainer.classList.remove('closed');
};

const updateLogItems = async ($logMenu) => {
  const $logItems = $logMenu.querySelector('.log-items');
  const logDatas = await request.getLog();
  $logItems.innerHTML = '';
  logDatas.forEach((logData) => {
    $logItems.append(makeLogMenuItemElement(logData));
  });
};

const closeMenu = ($logMenu) => {
  const $logContainer = $logMenu.querySelector('.log-container');
  $logContainer.classList.add('closed');
};
