import './index.scss';
import makeTaskCardColumnElement from './TaskCardList';
import { createElement } from '@util/domUtil';

const makeTaskBoardElement = (taskListDatas) => {
  const $taskBoard = createElement('section', 'task-board');
  taskListDatas.forEach((taskListData) => {
    $taskBoard.append(makeTaskCardColumnElement(taskListData));
  });
  return $taskBoard;
};

export default makeTaskBoardElement;
