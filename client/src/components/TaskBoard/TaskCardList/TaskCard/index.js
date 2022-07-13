import './index.scss';
import { makeEditingTaskCardElement } from '../EditingTaskCard';
import { makeAlertModalElement } from '../../../Modal';
import {
  insertElementBefore,
  insertElementAfter,
  hasClassName,
  getElementIndex,
} from '@util/domUtil.js';

export const makeTaskCardElement = (cardData) => {
  const $taskCard = document.createElement('li');
  $taskCard.className = 'taskcard';
  $taskCard.dataset.id = cardData.id;
  $taskCard.innerHTML = getTaskCardInnerTemplate(cardData);
  activateElement($taskCard, cardData);
  return $taskCard;
};

const getTaskCardInnerTemplate = (cardData) => {
  const { title, details, author } = cardData;
  return `
    <h3 class="taskcard__title">${title}</h3>
    <ul class="taskcard__detail-container">
      ${getTaskDetailTemplate(details)}
    </ul>
    <span class="taskcard__author">author by ${author}</span>
    <button class="util__btn util__btn--delete taskcard__delete-btn"></button>
  `;
};

const getTaskDetailTemplate = (details) => {
  return details
    .map((detail) => `<li class="taskcard__detail">${detail}</li>`)
    .join('');
};

const activateElement = ($taskCard, cardData) => {
  const $deleteBtn = $taskCard.querySelector('.taskcard__delete-btn');
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

  $deleteBtn.addEventListener(
    'click',
    handleDeleteBtnClick.bind(null, cardData.id)
  );

  $taskCard.addEventListener(
    'mousedown',
    startDragNDrop.bind(null, $taskCard, cardData.columnId)
  );
};

const convertToEditMode = ($taskCard, cardData) => {
  const $editingCardElement = makeEditingTaskCardElement(
    'EDIT',
    cardData,
    $taskCard
  );
  $taskCard.parentNode.replaceChild($editingCardElement, $taskCard);
};

const showDeleteWarning = ($taskCard, $deleteBtn, e) => {
  $taskCard.classList.toggle('taskcard__delete-warn');
  $deleteBtn.classList.toggle('util__btn--delete-warn');
};

const handleDeleteBtnClick = (cardId, { target }) => {
  target.parentNode.append(makeAlertModalElement(cardId));
};

const startDragNDrop = ($taskCard, columnId, e) => {
  //원래 정보
  const [originalCardTop, originalCardLeft] = getCardPositions($taskCard);
  const originalColumnID = columnId;
  const originalCardIdx = getElementIndex($taskCard);

  const $shadowCard = makeShadowCardNode($taskCard);
  const $followingCard = makeFollowingCardNode(
    $taskCard,
    originalCardTop,
    originalCardLeft
  );

  //카드 내 mouse위치
  const pointerInCardX = e.clientX - originalCardLeft;
  const pointerInCardY = e.clientY - originalCardTop;

  const mouseMoveHandler = getMouseMoveHandler(
    pointerInCardX,
    pointerInCardY,
    $shadowCard,
    $followingCard
  );
  const mouseUpHandler = getMouseUpHandler(
    mouseMoveHandler,
    $shadowCard,
    $followingCard,
    originalColumnID,
    originalCardIdx
  );
  document.body.addEventListener('mousemove', mouseMoveHandler);
  document.body.addEventListener('mouseup', mouseUpHandler, { once: true });
};

const getCardPositions = ($card) => {
  const originalCardTop = $card.getBoundingClientRect().top;
  const originalCardLeft = $card.getBoundingClientRect().left;
  return [originalCardTop, originalCardLeft];
};

const makeShadowCardNode = ($card) => {
  const $shadowCard = $card.cloneNode(true);
  $shadowCard.classList.add('shadow');
  insertElementBefore($shadowCard, $card);
  return $shadowCard;
};

const makeFollowingCardNode = ($card, originalCardTop, originalCardLeft) => {
  const followingCardNode = $card;
  followingCardNode.classList.add('following');
  moveFollowingCard($card, originalCardLeft, originalCardTop);
  return followingCardNode;
};

const moveFollowingCard = ($card, posX, posY) => {
  $card.style.left = posX + 'px';
  $card.style.top = posY + 'px';
};

const getMouseMoveHandler =
  (pointerInCardX, pointerInCardY, $shadowCard, $followingCard) => (event) => {
    handleFollowingCard(pointerInCardX, pointerInCardY, $followingCard, event);
    handleCardShadow($shadowCard, $followingCard, event);
  };

const getMouseUpHandler =
  (
    mouseMoveHandler,
    shadowCardNode,
    followingCardNode,
    originalParentColumnID,
    originalCardIdx
  ) =>
  () => {
    endDragDropEvent(
      mouseMoveHandler,
      shadowCardNode,
      followingCardNode,
      originalParentColumnID,
      originalCardIdx
    );
  };

const handleFollowingCard = (shiftX, shiftY, $followingCard, event) => {
  const [posX, posY] = getCardPosition(shiftX, shiftY, event);
  moveFollowingCard($followingCard, posX, posY);
};

const getCardPosition = (shiftX, shiftY, event) => {
  const x = event.clientX - shiftX;
  const y = event.clientY - shiftY;
  return [x, y];
};

const handleCardShadow = ($shadowCard, $followingCard, event) => {
  const underMouseElement = getUnderMouseElement(
    $followingCard,
    event.clientX,
    event.clientY
  );
  const underMouseElementClass = inspectElementClass(underMouseElement);
  moveCardShadow(underMouseElementClass, underMouseElement, $shadowCard, event);
};

const moveCardShadow = (
  underMouseElementClass,
  underMouseElement,
  shadowCardNode,
  event
) => {
  switch (underMouseElementClass) {
    case 'taskcard':
      moveToAroundCard(underMouseElement, shadowCardNode, event);
      return;
    case 'card-content':
      const parentCardElement = underMouseElement.closest('.taskcard');
      moveToAroundCard(parentCardElement, shadowCardNode, event);
      return;
    case 'taskcard-list':
      moveToColumn(underMouseElement, shadowCardNode);
      return;
  }
};

const moveToAroundCard = (underMouseCardElement, cardNode, event) => {
  const rect = underMouseCardElement.getBoundingClientRect();
  if (event.clientY < (rect.top + rect.bottom) / 2) {
    insertElementBefore(cardNode, underMouseCardElement);
  } else {
    insertElementAfter(cardNode, underMouseCardElement);
  }
};

const moveToColumn = (underMouseColumnElement, cardNode) => {
  underMouseColumnElement.append(cardNode);
};

const getUnderMouseElement = (followingCardNode, x, y) => {
  followingCardNode.hidden = true;
  const underMouseElement = document.elementFromPoint(x, y);
  followingCardNode.hidden = false;
  return underMouseElement;
};

const inspectElementClass = (underMouseElement) => {
  if (
    hasClassName(underMouseElement, 'taskcard') &&
    !hasClassName(underMouseElement, 'shadow')
  ) {
    return 'taskcard';
  } else if (hasClassName(underMouseElement, 'taskcard-list')) {
    return 'taskcard-list';
  } else if (underMouseElement.closest('.taskcard')) {
    return 'card-content';
  } else {
    return 'others';
  }
};

const endDragDropEvent = (
  mouseMoveHandler,
  shadowCardNode,
  followingCardNode,
  originalParentColumnID,
  originalCardIdx
) => {
  document.body.removeEventListener('mousemove', mouseMoveHandler);
  putFollowingCardOnShadow(followingCardNode, shadowCardNode);
  disconnectFollowingCard(followingCardNode);
  shadowCardNode.remove();
  updateResult(followingCardNode, originalParentColumnID, originalCardIdx);
};

const putFollowingCardOnShadow = (followingCardNode, shadowCardNode) => {
  insertElementBefore(followingCardNode, shadowCardNode);
};

const disconnectFollowingCard = (followingCardNode) => {
  followingCardNode.classList.remove('following');
  followingCardNode.style.left = 0;
  followingCardNode.style.top = 0;
};

const updateResult = (
  followingCardNode,
  originalParentColumnID,
  originalCardIdx
) => {
  const newParentColumnID = Number(
    followingCardNode.closest('.taskcard-column').dataset.id
  );
  const cardID = followingCardNode.dataset.id;
  const movedIdx = getElementIndex(followingCardNode);
  if (
    isCardPositionChanged(
      originalParentColumnID,
      newParentColumnID,
      originalCardIdx,
      movedIdx
    )
  )
    console.log('changed!');
};

const isCardPositionChanged = (
  originalParentColumnID,
  newParentColumnID,
  originalCardIdx,
  movedIdx
) => {
  return (
    originalParentColumnID !== newParentColumnID || originalCardIdx !== movedIdx
  );
};
