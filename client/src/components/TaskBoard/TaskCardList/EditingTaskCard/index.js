import './index.scss';
import { makeTaskCardElement } from '../TaskCard';
export const makeEditingTaskCardElement = (originalCardData = {}) => {
  const $editingTaskCard = document.createElement('div');
  $editingTaskCard.className = 'taskCard editing';
  $editingTaskCard.innerHTML = getInnerTemplate(originalCardData);
  activateElement($editingTaskCard, originalCardData);
  return $editingTaskCard;
};

const getInnerTemplate = (originalCardData = {}) => {
  const { title, details, author } = originalCardData;
  return `
      <input type = "text" class="taskCard__title editing" placeholder="제목을 입력하세요" value=${
        title ? title : ''
      }>
      ${getEditingTaskDetailTemplate(details)}
      <div class="util__btns">
          <button class="util__btn--big util__btn--cancel">취소</button>
          <button class="util__btn--big util__btn--confirm">등록</button>
      </div>
    `;
};

const getEditingTaskDetailTemplate = (details) => {
  const originalDetailContent = details ? details.join('\n') : '';
  return `<textarea placeholder="내용을 입력하세요" class="taskCard__detail--editing">${originalDetailContent}</textarea>`;
};

const activateElement = ($editingTaskCard, originalCardData) => {
  const $cancelBtn = $editingTaskCard.querySelector('.util__btn--cancel');
  $cancelBtn.addEventListener(
    'click',
    cancelEdit.bind(null, $editingTaskCard, originalCardData)
  );
};

const cancelEdit = ($editingTaskCard, originalCardData) => {
  const $taskCardElement = makeTaskCardElement(originalCardData);
  $editingTaskCard.parentNode.replaceChild($taskCardElement, $editingTaskCard);
};
