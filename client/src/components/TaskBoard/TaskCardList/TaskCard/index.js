import './index.scss';

export const makeTaskCardElement = (cardData) => {
  const $taskCard = document.createElement('li');
  $taskCard.className = 'taskCard';
  $taskCard.innerHTML = getTaskCardInnerTemplate(cardData);
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
