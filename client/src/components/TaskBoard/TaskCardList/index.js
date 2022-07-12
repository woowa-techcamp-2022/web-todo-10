import './index.scss';
import TaskCard from './TaskCard';

export default class TaskCardList {
  #$taskCardList;
  #taksCards;

  constructor($parent, cardListData) {
    this.$parent = $parent;
    this.cardListData = cardListData;
    this.#makeDOM();
    this.#render();
    this.#mountTaskCards();
  }

  #makeDOM() {
    this.#$taskCardList = document.createElement('section');
    this.#$taskCardList.className = 'taskcard-list';
  }

  #render() {
    this.#$taskCardList.innerHTML = this.#getInnerTemplate();
    this.$parent.append(this.#$taskCardList);
  }

  #getInnerTemplate() {
    const { listName, tasks } = this.cardListData;
    return `
      <div class="taskcard-list__header">
      <div class="taskcard-list__info">
        <h2 class="taskcard-list__title">${listName}</h2>
        <div class="taskcard-list__count">${tasks.length}</div>
      </div>
      <div class="taskcard-list__utils">
        <button class="taskcard-list__add-btn util__btn util__btn--add"></button>
        <button class="taskcard-list__delete-btn util__btn util__btn--delete"></button>
      </div>
    `;
  }

  #mountTaskCards() {
    const cardDataArr = this.cardListData.tasks;
    this.#taksCards = cardDataArr.map(
      (cardData) => new TaskCard(this.#$taskCardList, cardData)
    );
  }
}
