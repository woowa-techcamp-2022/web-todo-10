import './index.scss';

export default class Modal {
  constructor(message) {
    this.message = message;
    this.#makeDOM();
    this.#render();
  }

  #makeDOM() {
    this.$modalContainer = document.createElement('div');
    this.$modalContainer.className = 'modal-container';
  }

  #render() {
    this.$modalContainer.innerHTML = this.#getInnerHTML();
    document.body.append(this.$modalContainer);
  }

  #getInnerHTML() {
    return `
      <div class="modal">
        <h3 class="modal__message">${message}</h3>
        <div class="util__btns">
          <button class="util__btn--big util__btn--cancel">취소</button>
          <button class="util__btn--big util__btn--confirm">삭제</button>
        </div>
      </div>
    `;
  }
}
