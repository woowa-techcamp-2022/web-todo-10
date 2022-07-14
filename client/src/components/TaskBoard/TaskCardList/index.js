import './index.scss';
import { makeTaskCardElement } from './TaskCard';
import { makeEditingTaskCardElement } from './EditingTaskCard';
import request from '@util/fetchUtil';

export const makeTaskCardColumnElement = (cardListData) => {
  const { columnName, tasks, id: columnId } = cardListData;
  const $taskCardColumn = document.createElement('section');
  $taskCardColumn.className = 'taskcard-column';
  $taskCardColumn.dataset.id = columnId;
  $taskCardColumn.innerHTML = getHeaderTemplate(columnName, tasks.length);
  $taskCardColumn.append(makeTaskListElement(tasks));
  activateElement($taskCardColumn, columnId);
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
  const $taskCardList = document.createElement('ul');
  $taskCardList.classList = 'taskcard-list';
  tasks.forEach((taskData) =>
    $taskCardList.append(makeTaskCardElement(taskData))
  );
  return $taskCardList;
};

const activateElement = ($taskCardColumn, columnId) => {
  const $addBtn = $taskCardColumn.querySelector('.taskcard-column__add-btn');
  $addBtn.addEventListener('click', addNewTaskCard.bind(null, $taskCardColumn));
  $taskCardColumn.addEventListener(
    'changeCard',
    updateList.bind(null, $taskCardColumn, columnId)
  );
};

const addNewTaskCard = ($taskCardColumn) => {
  const $editingTaskCard = makeEditingTaskCardElement('NEW');
  const $taksCardList = $taskCardColumn.querySelector('.taskcard-list');
  $taksCardList.insertAdjacentElement('afterbegin', $editingTaskCard);
};

const updateList = async ($taskCardColumn, columnId) => {
  const updatedColumnData = await request.getList(columnId);
  const $updatedListElement = makeTaskCardColumnElement(updatedColumnData);
  $taskCardColumn.parentNode.replaceChild($updatedListElement, $taskCardColumn);
};
