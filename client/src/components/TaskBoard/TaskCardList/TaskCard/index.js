import './index.scss';

export default class TaskCard {
  #$taskCard;

  constructor($parent, cardData) {
    this.$parent = $parent;
    this.cardData = cardData;
    this.#makeDOM();
    this.#render();
  }

  #makeDOM() {
    this.#$taskCard = document.createElement('div');
    this.#$taskCard.className = 'taskCard';
  }

  #render() {
    this.#$taskCard.innerHTML = this.#getInnerTemplate();
    this.$parent.append(this.#$taskCard);
  }

  #getInnerTemplate() {
    const { title, details, author } = this.cardData;
    return `
        <h3 class="taskCard__title">${title}</h3>
        <ul class="taskCard__detail-container">
          ${this.#getTaskDetailTemplate(details)}
        </ul>
        <span class="taskCard__author">author by ${author}</span>
        <button class="util__btn util__btn--delete taskCard__delete-btn"></button>
    `;
  }

  #getTaskDetailTemplate(details) {
    return details
      .map((detail) => `<li class="taskCard__detail">${detail}</li>`)
      .join('');
  }
}
