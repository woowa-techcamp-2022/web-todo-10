import './index.scss';

export const makeEditingTaskCardElement = (
  originalCardData = {},
  $taskCard
) => {
  const $editingTaskCard = document.createElement('form');
  $editingTaskCard.className = 'taskCard editing';
  $editingTaskCard.innerHTML = getInnerTemplate(originalCardData);
  activateElement($editingTaskCard, $taskCard);
  return $editingTaskCard;
};

const getInnerTemplate = (originalCardData = {}) => {
  const { title, details } = originalCardData;
  return `
      <input type = "text" name='title' class="taskCard__title editing" placeholder="제목을 입력하세요" value='${title}' >
      ${getEditingTaskDetailTemplate(details)}
      <div class="util__btns">
          <button class="util__btn--big util__btn--cancel">취소</button>
          <button type='submit' class="util__btn--big util__btn--confirm">등록</button>
      </div>
    `;
};

const getEditingTaskDetailTemplate = (details) => {
  const originalDetailContent = details ? details.join('\n') : '';
  return `<textarea name='details' placeholder="내용을 입력하세요" class="taskCard__detail--editing">${originalDetailContent}</textarea>`;
};

const activateElement = ($editingTaskCard, $taskCard) => {
  const $cancelBtn = $editingTaskCard.querySelector('.util__btn--cancel');
  $cancelBtn.addEventListener(
    'click',
    cancelEdit.bind(null, $editingTaskCard, $taskCard)
  );
  $editingTaskCard.addEventListener('submit', confirmEdit);
};

const cancelEdit = ($editingTaskCard, $taskCard) => {
  $editingTaskCard.parentNode.replaceChild($taskCard, $editingTaskCard);
};

const confirmEdit = (event) => {
  event.preventDefault();
  const { title, details } = event.target.elements;
};
