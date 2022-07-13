import './index.scss';
import { makeTaskCardElement } from './TaskCard';
import { makeEditingTaskCardElement } from './EditingTaskCard';
import request from '@util/fetchUtil';

export const makeTaskCardColumnElement = (cardListData) => {
  const { listName, tasks, id } = cardListData;
  const $taskCardColumn = document.createElement('section');
  $taskCardColumn.className = 'taskcard-column';
  $taskCardColumn.dataset.id = id;
  $taskCardColumn.insertAdjacentHTML(
    'afterbegin',
    getHeaderTemplate(listName, tasks.length)
  );
  $taskCardColumn.append(makeTaskListElement(tasks));
  activateElement($taskCardColumn);
  return $taskCardColumn;
};

const getHeaderTemplate = (listName, tasksCnt) => {
  return `
      <div class="taskcard-column__header">
      <div class="taskcard-column__info">
        <h2 class="taskcard-column__title">${listName}</h2>
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

const activateElement = ($taskCardColumn) => {
  const $addBtn = $taskCardColumn.querySelector('.taskcard-column__add-btn');
  $addBtn.addEventListener('click', addNewTaskCard.bind(null, $taskCardColumn));
  $taskCardColumn.addEventListener('changeCard', updateList);
};

const addNewTaskCard = ($taskCardColumn) => {
  const $editingTaskCard = makeEditingTaskCardElement();
  const $taksCardList = $taskCardColumn.querySelector('.taskcard-list');
  $taksCardList.insertAdjacentElement('afterbegin', $editingTaskCard);
};

const updateList = () => {
  const updatedList = $taskCardColumn.parentNode.replaceChild();
};
