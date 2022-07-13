import './index.scss';
import { makeEditingTaskCardElement } from '../EditingTaskCard';
import { makeAlertModalElement } from '../../../Modal';
import {
  insertElementBefore,
  insertElementAfter,
  hasClassName,
  getElementIndex,
} from '@util/domUtil.js';
import Point from '@util/Point';
import { getElementPos } from '../../../../util/domUtil';

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
    handleMouseDownEvent.bind(null, $taskCard, cardData.columnId)
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

////////////////
////////////////
////////////////
////////////////
////////////////
////////////////
////////////////
////////////////
////////////////
////////////////
////////////////
////////////////

const handleMouseDownEvent = ($taskCard, columnId, e) => {
  if (e.detail !== 1) return;
  startDragNDrop($taskCard, columnId, e);
};

const startDragNDrop = ($taskCard, columnId, event) => {
  const originalColumnID = columnId;
  const originalCardIdx = getElementIndex($taskCard);

  const originalCardPos = getOriginalCardPos($taskCard);
  const pointerPosOnCard = getPointerPosOnCard(event, originalCardPos);

  const $shadowCard = makeShadowCardElement($taskCard);
  const $followingCard = makeFollowingCardElement($taskCard, originalCardPos);

  const dragHandler = handleDragPointer.bind(
    null,
    $followingCard,
    $shadowCard,
    pointerPosOnCard
  );
  const mouseUpHandler = getMouseUpHandler(
    dragHandler,
    $shadowCard,
    $followingCard,
    originalColumnID,
    originalCardIdx
  );

  document.body.addEventListener('mousemove', dragHandler);
  document.body.addEventListener('mouseup', mouseUpHandler, { once: true });
  // document.body.addEventListener(
  //   'dragend',
  //   handleDragEventEnd.bind(null, mouseMoveHandler),
  //   { once: true }
  // );
};

// const handleDragEventEnd = (mouseMoveHandler) => {
//   document.body.removeEventListener('mousemove', mouseMoveHandler);
// };

const getOriginalCardPos = ($taskCard) => {
  const [originalCardX, originalCardY] = getElementPos($taskCard);
  return new Point(originalCardX, originalCardY);
};

const getPointerPosOnCard = (event, cardPos) => {
  const pointerInCardX = event.clientX - cardPos.x;
  const pointerInCardY = event.clientY - cardPos.y;
  return new Point(pointerInCardX, pointerInCardY);
};

const makeShadowCardElement = ($card) => {
  const $shadowCard = $card.cloneNode(true);
  $shadowCard.classList.add('shadow');
  insertElementBefore($shadowCard, $card);
  return $shadowCard;
};

const makeFollowingCardElement = ($card, originalCardPos) => {
  const followingCardNode = $card;
  followingCardNode.classList.add('following');
  moveFollowingCard(followingCardNode, originalCardPos);
  return followingCardNode;
};

const moveFollowingCard = ($card, pos) => {
  $card.style.left = pos.x + 'px';
  $card.style.top = pos.y + 'px';
};

const handleDragPointer = (
  $followingCard,
  $shadowCard,
  pointerPosOnCard,
  event
) => {
  const currPointerPos = new Point(event.clientX, event.clientY);
  handleFollowingCard($followingCard, pointerPosOnCard, currPointerPos);
  handleCardShadow($followingCard, $shadowCard, currPointerPos);
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

const handleFollowingCard = (
  $followingCard,
  pointerPosOnCard,
  currPointerPos
) => {
  const cardPos = new Point(...currPointerPos.diff(pointerPosOnCard));
  moveFollowingCard($followingCard, cardPos);
};

const handleCardShadow = ($followingCard, $shadowCard, currPointerPos) => {
  const nearElement = getNearElement($followingCard, currPointerPos);
  moveCardShadow(nearElement, $shadowCard, currPointerPos);
};

const moveCardShadow = (nearElement, $shadowCard, currPointerPos) => {
  const nearElementType = inspectNearElementType(nearElement);
  switch (nearElementType) {
    case 'TASKCARD':
      moveToAroundCard(nearElement, $shadowCard, currPointerPos);
      return;
    case 'TASKCARD_CONTENT':
      const parentCardElement = nearElement.closest('.taskcard');
      moveToAroundCard(parentCardElement, $shadowCard, currPointerPos);
      return;
    case 'TASKCARD_WRAPPER':
      moveToColumn(nearElement, $shadowCard);
      return;
  }
};

const moveToAroundCard = (cardElement, $shadowCard, currPointerPos) => {
  const { top, bottom } = cardElement.getBoundingClientRect();
  if (currPointerPos.y < (top + bottom) / 2) {
    insertElementBefore($shadowCard, cardElement);
  } else {
    insertElementAfter($shadowCard, cardElement);
  }
};

const moveToColumn = (columnElement, $shadowCard) => {
  columnElement.append($shadowCard);
};

const getNearElement = ($followingCard, pointerPos) => {
  $followingCard.hidden = true;
  const nearElement = document.elementFromPoint(pointerPos.x, pointerPos.y);
  $followingCard.hidden = false;
  return nearElement;
};

const inspectNearElementType = (underPointerElement) => {
  if (
    hasClassName(underPointerElement, 'taskcard') &&
    !hasClassName(underPointerElement, 'shadow')
  ) {
    return 'TASKCARD';
  } else if (hasClassName(underPointerElement, 'taskcard-list')) {
    return 'TASKCARD_WRAPPER';
  } else if (underPointerElement.closest('.taskcard')) {
    return 'TASKCARD_CONTENT';
  } else {
    return 'OTHERS';
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
