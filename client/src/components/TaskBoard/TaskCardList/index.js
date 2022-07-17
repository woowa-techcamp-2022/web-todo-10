import './index.scss';
import makeTaskCardElement from './TaskCard';
import { makeEditingTaskCardElement } from './EditingTaskCard';
import { createElement, replaceElement } from '@util/domUtil';
import request from '@util/fetchUtil';

const makeTaskCardColumnElement = (cardListData) => {
  const { columnName, tasks, id: columnId } = cardListData;
  const $taskCardColumn = createElement('section', 'taskcard-column');
  $taskCardColumn.dataset.id = columnId;
  $taskCardColumn.innerHTML = getHeaderTemplate(columnName, tasks.length);
  $taskCardColumn.append(makeTaskListElement(tasks));
  activateElement($taskCardColumn);
  return $taskCardColumn;
};

const getHeaderTemplate = (columnName, tasksCnt) => {
  return `
      <div class="taskcard-column__header">
      <div class="taskcard-column__info">
        <h2 class="taskcard-column__title">${columnName}</h2>
        <div class="taskcard-column__count">${tasksCnt}</div>
      </div>
      <div class="taskcard-list__utils">
        <button class="taskcard-column__add-btn util__btn util__btn--add"></button>
        <button class="taskcard-column__delete-btn util__btn util__btn--delete"></button>
      </div>
    `;
};

const makeTaskListElement = (tasks) => {
  const $taskCardList = createElement('ul', 'taskcard-list');
  tasks.forEach((taskData) =>
    $taskCardList.append(makeTaskCardElement(taskData))
  );
  return $taskCardList;
};

const activateElement = ($taskCardColumn) => {
  const $addBtn = $taskCardColumn.querySelector('.taskcard-column__add-btn');
  $addBtn.addEventListener('click', () => handleAddBtnClick($taskCardColumn));
  $taskCardColumn.addEventListener('changeCard', () =>
    updateList($taskCardColumn)
  );
};

const handleAddBtnClick = ($taskCardColumn) => {
  const $taskCardList = $taskCardColumn.querySelector('.taskcard-list');
  const $firstTaskCard = $taskCardList.firstElementChild;
  if ($firstTaskCard?.dataset.type === 'NEW') {
    $firstTaskCard.remove();
  } else {
    addNewTaskCard($taskCardList);
  }
};

const addNewTaskCard = ($taskCardList) => {
  const $editingTaskCard = makeEditingTaskCardElement('NEW');
  $taskCardList.insertAdjacentElement('afterbegin', $editingTaskCard);
};

const updateList = async ($taskCardColumn) => {
  const columnId = $taskCardColumn.dataset.id;
  const updatedColumnData = await request.getList(columnId);
  const $updatedListElement = makeTaskCardColumnElement(updatedColumnData);
  replaceElement($taskCardColumn, $updatedListElement);
};

export default makeTaskCardColumnElement;
