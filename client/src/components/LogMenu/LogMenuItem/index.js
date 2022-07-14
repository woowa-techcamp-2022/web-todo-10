import './index.scss';
import { ACTION_TYPE_EMOJI_MAP } from '@/constant';

export const makeLogMenuItemElement = (logItemData) => {
  const $logMenuItem = document.createElement('div');
  $logMenuItem.className = 'log';
  $logMenuItem.innerHTML = getLogItemTemplate(logItemData);
  return $logMenuItem;
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
  const { originalColumnName, changedColumnName, taskTitle } = logItemData;
  return `
    ${highlightText(taskTitle)}를 ${highlightText(
    originalColumnName
  )}에서 ${highlightText(changedColumnName)}로 이동하였습니다.`;
};

const getAddLogText = (logItemData) => {
  const { originalColumnName, taskTitle } = logItemData;
  return `
  ${highlightText(originalColumnName)}에 ${highlightText(
    taskTitle
  )}를 등록하였습니다.`;
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
