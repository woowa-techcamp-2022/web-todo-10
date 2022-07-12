import './index.scss';
import { makeTaskCardElement } from './TaskCard';

export const makeTaskCardListElement = (cardListData) => {
  const { listName, tasks } = cardListData;
  const $taskCardList = document.createElement('section');
  $taskCardList.className = 'taskcard-list';
  $taskCardList.innerHTML = getInnerTemplate(listName, tasks.length);
  tasks.forEach((taskData) =>
    $taskCardList.append(makeTaskCardElement(taskData))
  );
  activateElement();
  return $taskCardList;
};

const getInnerTemplate = (listName, tasksCnt) => {
  return `
      <div class="taskcard-list__header">
      <div class="taskcard-list__info">
        <h2 class="taskcard-list__title">${listName}</h2>
        <div class="taskcard-list__count">${tasksCnt}</div>
      </div>
      <div class="taskcard-list__utils">
        <button class="taskcard-list__add-btn util__btn util__btn--add"></button>
        <button class="taskcard-list__delete-btn util__btn util__btn--delete"></button>
      </div>
    `;
};

const activateElement = ($taskCardList) => {
  const $addBtn = $taskCardList.querySelector('.taskcard-list__add-btn');
  $addBtn.addEventListener('click', addNewTaskCard.bind(null, $taskCardList));
};

const addNewTaskCard = ($taskCardList) => {
  const $editingTaskCard = makeEditingTaskCard();
  $taskCardList.insertAdjacentElement('afterbegin', $editingTaskCard);
};
