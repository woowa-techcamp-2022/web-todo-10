import './index.scss';
import { makeEditingTaskCardElement } from '../EditingTaskCard';

export const makeTaskCardElement = (cardData) => {
  const $taskCard = document.createElement('li');
  $taskCard.className = 'taskCard';
  $taskCard.innerHTML = getTaskCardInnerTemplate(cardData);
  activateElement($taskCard, cardData);
  return $taskCard;
};

const getTaskCardInnerTemplate = (cardData) => {
  const { title, details, author } = cardData;
  return `
    <h3 class="taskCard__title">${title}</h3>
    <ul class="taskCard__detail-container">
      ${getTaskDetailTemplate(details)}
    </ul>
    <span class="taskCard__author">author by ${author}</span>
    <button class="util__btn util__btn--delete taskCard__delete-btn"></button>
  `;
};

const getTaskDetailTemplate = (details) => {
  return details
    .map((detail) => `<li class="taskCard__detail">${detail}</li>`)
    .join('');
};

const activateElement = ($taskCard, cardData) => {
  const $deleteBtn = $taskCard.querySelector('.taskCard__delete-btn');
  $taskCard.addEventListener(
    'dblclick',
    convertToEditMode.bind(null, $taskCard, cardData)
  );

  $deleteBtn.addEventListener(
    'mouseover',
    showDeleteWarning.bind(null, $taskCard, $deleteBtn)
  );
  $deleteBtn.addEventListener(
    'mouseleave',
    showDeleteWarning.bind(null, $taskCard, $deleteBtn)
  );
};

const convertToEditMode = ($taskCard, cardData) => {
  const $editingCardElement = makeEditingTaskCardElement(cardData, $taskCard);
  $taskCard.parentNode.replaceChild($editingCardElement, $taskCard);
};

const showDeleteWarning = ($taskCard, $deleteBtn, e) => {
  $taskCard.classList.toggle('taskCard__delete-warn');
  $deleteBtn.classList.toggle('util__btn--delete-warn');
};
