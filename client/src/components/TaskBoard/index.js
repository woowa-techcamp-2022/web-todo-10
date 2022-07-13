import './index.scss';
import { makeTaskCardColumnElement } from './TaskCardList';

export const makeTaskBoardElement = (taskListDatas) => {
  const $taskBoard = document.createElement('section');
  $taskBoard.className = 'task-board';
  taskListDatas.forEach((taskListData) => {
    $taskBoard.append(makeTaskCardColumnElement(taskListData));
  });
  return $taskBoard;
};
