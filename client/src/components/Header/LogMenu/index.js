import './index.scss';
import { ACTION_TYPE_EMOJI_MAP } from '@/constant';

export const makeLogMenuElement = (logData) => {
  const $logMenu = document.createElement('div');
  $logMenu.className = 'log-container';
  $logMenu.innerHTML = getInnerTemplate(logData);
  activateElement($logMenu);
  return $logMenu;
};

const getInnerTemplate = (logData) => {
  const closeBtnTemplate = getCloseBtnTemplate();
  const logItemsTemplate = logData.map(getLogItemTemplate).join('');
  return closeBtnTemplate + logItemsTemplate;
};

const getCloseBtnTemplate = () => {
  return `<button class='close-btn'></button>`;
};

const getLogItemTemplate = (logItemData) => {
  const { actionType, regDate } = logItemData;

  return `
    <div class="log">
      <span class="log-emoji">${ACTION_TYPE_EMOJI_MAP[actionType]}</span>
      <div class="log-content">
        <p class="log-description">
          ${getLogItemText(actionType, logItemData)}
        </p>
        <span class="log-timestamp">${calTimePassed(
          new Date(regDate)
        )} 전</span>
      </div>
    </div>
    `;
};

const getLogItemText = (actionType, logItemData) => {
  const actionTypeMap = {
    MOVE: getMoveLogText,
    ADD: getAddLogText,
    EDIT_TITLE: getEditTitleText,
    EDIT_CONTENT: getEditContentText,
    DELETE: getDeleteText,
  };

  return actionTypeMap[actionType](logItemData);
};

const getMoveLogText = (logItemData) => {
  const { start, end, taskTitle } = logItemData;
  return `
    ${highlightText(taskTitle)}를 ${highlightText(start)}에서 ${highlightText(
    end
  )}로 이동하였습니다.`;
};

const getAddLogText = (logItemData) => {
  const { start, taskTitle } = logItemData;
  return `
  ${highlightText(start)}에 ${highlightText(taskTitle)}를 등록하였습니다.`;
};

const getEditTitleText = (logItemData) => {
  const { taskTitle, prevTaskTitle } = logItemData;
  return `
    ${highlightText(prevTaskTitle)}를 ${highlightText(
    taskTitle
  )}로 수정하였습니다.`;
};

const getEditContentText = (logItemData) => {
  const { taskTitle } = logItemData;
  return `${highlightText(taskTitle)}의 내용을 수정하였습니다.`;
};

const getDeleteText = (logItemData) => {
  const { taskTitle } = logItemData;
  return `${highlightText(taskTitle)}을 삭제했습니다.`;
};

const highlightText = (text) => {
  return `<strong>${text}</strong>`;
};

const calTimePassed = (targetDate) => {
  const millisecond = new Date().getTime() - targetDate.getTime();
  if (millisecond < 1000) return '방금';
  const seconds = Math.ceil(millisecond / 1000);
  if (seconds < 60) return `${seconds}초`;
  const minutes = Math.ceil(seconds / 60);
  if (minutes < 60) return `${minutes}분`;
  const hours = Math.ceil(minutes / 60);
  if (hours < 24) return `${hours}시간`;
  const date = Math.ceil(hours / 24);
  return `${date}일`;
};

const activateElement = ($logMenu) => {
  const $colseBtn = $logMenu.querySelector('.close-btn');
  $colseBtn.addEventListener('click', closeMenu.bind(null, $logMenu));
};

const closeMenu = ($logMenu) => {
  $logMenu.remove();
};
