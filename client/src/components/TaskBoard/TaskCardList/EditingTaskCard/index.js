import './index.scss';
import request from '@util/fetchUtil.js';

export const makeEditingTaskCardElement = (
  originalCardData = {},
  $originalTaskCard = null
) => {
  const $editingTaskCard = document.createElement('form');
  $editingTaskCard.className = 'taskCard editing';
  $editingTaskCard.dataset.id = originalCardData?.id;
  $editingTaskCard.innerHTML = getInnerTemplate(originalCardData);
  activateElement($editingTaskCard, $originalTaskCard);
  return $editingTaskCard;
};

const getInnerTemplate = (originalCardData = {}) => {
  const { title, details } = originalCardData;
  return `
      <input type = "text" name='title' class="taskCard__title editing" placeholder="제목을 입력하세요" value='${title}' >
      ${getEditingTaskDetailTemplate(details)}
      <div class="util__btns">
          <button class="util__btn--big util__btn--cancel">취소</button>
          <button type='submit' class="util__btn--big util__btn--confirm" disabled>등록</button>
      </div>
    `;
};

const getEditingTaskDetailTemplate = (details) => {
  const originalDetailContent = details ? details.join('\n') : '';
  return `<textarea name='details' placeholder="내용을 입력하세요" class="taskCard__detail--editing">${originalDetailContent}</textarea>`;
};

const activateElement = ($editingTaskCard, $originalTaskCard) => {
  const $cancelBtn = $editingTaskCard.querySelector('.util__btn--cancel');
  const $submitBtn = $editingTaskCard.querySelector('.util__btn--confirm');
  const $titleInput = $editingTaskCard.querySelector('.taskCard__title');
  const $detailsTextArea = $editingTaskCard.querySelector(
    '.taskCard__detail--editing'
  );

  $cancelBtn.addEventListener(
    'click',
    cancelEdit.bind(null, $editingTaskCard, $originalTaskCard)
  );
  $editingTaskCard.addEventListener('submit', confirmEdit);
  $editingTaskCard.addEventListener(
    'input',
    checkAllInputValidity.bind(null, $titleInput, $detailsTextArea, $submitBtn)
  );
};

const checkAllInputValidity = ($titleInput, $detailsTextArea, $submitBtn) => {
  const isAllValid =
    $titleInput.value.trim().length && $detailsTextArea.value.trim().length;
  $submitBtn.disabled = !isAllValid;
};

const cancelEdit = ($editingTaskCard, $originalTaskCard) => {
  if ($originalTaskCard)
    $editingTaskCard.parentNode.replaceChild(
      $originalTaskCard,
      $editingTaskCard
    );
  else $editingTaskCard.remove();
};

const confirmEdit = async (event) => {
  event.preventDefault();
  const { title, details } = event.target.elements;
  const cardId = event.target.dataset.id;
  const listId = event.target.closest('.taskcard-column').dataset.id;
  const newTitle = title.value;
  const newDetails = details.value.split('\n');
  await request.updateCard(cardId, newTitle, newDetails, listId);
  event.target.dispatchEvent(new Event('changeCard', { bubbles: true }));
};
