export default class EditingTaskCard {
  #$editingTaskCard;

  constructor($parent, originalCardData = {}) {
    this.$parent = $parent;
    this.originalCardData = originalCardData;
    this.#makeEditingTaskCardElement();
  }

  render() {
    this.#$editingTaskCard.innerHTML = this.#getInnerTemplate();
    this.$parent.append(this.#$editingTaskCard);
  }

  #makeEditingTaskCardElement() {
    this.#$editingTaskCard = document.createElement('div');
    this.#$editingTaskCard.className = 'taskCard editing';
  }

  #getEditingTaskDetailTemplate(details) {
    const originalDetailContent = details ? details.join('\n') : '';
    return `
        <textarea placeholder="내용을 입력하세요" class="taskCard__detail--editing">
            ${originalDetailContent}
        </textarea>
    `;
  }

  #getInnerTemplate() {
    const { title, details } = this.originalCardData;
    return `
            <input type = "text" class="taskCard__title editing" placeholder="제목을 입력하세요">${title}</h3>
            ${this.#getEditingTaskDetailTemplate(details)}
            <div class="util__btns">
                <button class="util__btn--big util__btn--cancel">취소</button>
                <button class="util__btn--big util__btn--confirm">등록</button>
            </div>
        `;
  }
}
