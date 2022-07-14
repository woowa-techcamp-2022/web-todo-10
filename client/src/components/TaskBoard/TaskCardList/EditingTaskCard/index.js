import './index.scss';
import request from '@util/fetchUtil.js';
import { MAX_TASK_DETAIL_LENGTH } from '../../../../constant';

export const makeEditingTaskCardElement = (
  type,
  originalCardData = {},
  $originalTaskCard = null
) => {
  const $editingTaskCard = document.createElement('form');
  $editingTaskCard.className = 'taskcard';
  $editingTaskCard.classList.add('editing');
  $editingTaskCard.dataset.type = type;
  $editingTaskCard.dataset.id = originalCardData?.id;
  $editingTaskCard.innerHTML = getInnerTemplate(originalCardData);
  activateElement($editingTaskCard, $originalTaskCard, type);
  return $editingTaskCard;
};

const getInnerTemplate = (originalCardData = {}) => {
  const { title, details } = originalCardData;
  return `
      <div class='taskcard-contents'>
        <input type = "text" name='title' class="taskcard__title editing" placeholder="제목을 입력하세요" value='${
          title || ''
        }' >
        ${getEditingTaskDetailTemplate(details)}
        <div class="util__btns">
            <button class="util__btn--big util__btn--cancel">취소</button>
            <button type='submit' class="util__btn--big util__btn--confirm" disabled>등록</button>
        </div>
      </div>
    `;
};

const getEditingTaskDetailTemplate = (details) => {
  const originalDetailContent = details ? details.join('\n') : '';
  return `<textarea name='details' placeholder="내용을 입력하세요" class="taskcard__detail--editing" maxlength=${MAX_TASK_DETAIL_LENGTH}>${originalDetailContent}</textarea>`;
};

const activateElement = ($editingTaskCard, $originalTaskCard, type) => {
  const $cancelBtn = $editingTaskCard.querySelector('.util__btn--cancel');
  const $submitBtn = $editingTaskCard.querySelector('.util__btn--confirm');
  const $titleInput = $editingTaskCard.querySelector('.taskcard__title');
  const $detailsTextArea = $editingTaskCard.querySelector(
    '.taskcard__detail--editing'
  );

  $cancelBtn.addEventListener(
    'click',
    cancelEdit.bind(null, $editingTaskCard, $originalTaskCard)
  );
  $editingTaskCard.addEventListener(
    'submit',
    handleConfirmBtnClick.bind(null, type)
  );
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

const handleConfirmBtnClick = async (type, event) => {
  event.preventDefault();
  const { title, details } = event.target.elements;
  const cardId = event.target.dataset.id;
  const listId = event.target.closest('.taskcard-column').dataset.id;
  const newTitle = title.value;
  const newDetails = details.value.split('\n');
  if (type === 'EDIT')
    await request.updateCard(cardId, newTitle, newDetails, listId);
  else if (type === 'NEW') await request.addCard(listId, newTitle, newDetails);
  else throw new Error('invalid card type');
  event.target.dispatchEvent(new Event('changeCard', { bubbles: true }));
};
