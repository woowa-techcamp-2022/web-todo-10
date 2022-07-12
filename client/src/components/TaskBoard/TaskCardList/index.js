import './index.scss';
import TaskCard from './TaskCard';

export default class TaskCardList {
  #$taskCardList;
  #taskCards;

  constructor($parent, cardListData) {
    this.$parent = $parent;
    this.cardListData = cardListData;
    this.#makeDOM();
  }

  render() {
    this.#$taskCardList.innerHTML = this.#getInnerTemplate();
    this.#mountTaskCards();
    //this.#activate();
  }

  #makeDOM() {
    this.#$taskCardList = document.createElement('section');
    this.#$taskCardList.className = 'taskcard-list';
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
    this.#makeTaskCards();
    this.#taskCards.forEach((taskCard) => taskCard.render());
  }

  #makeTaskCards() {
    // 데이터 포맷팅 (나중에 달라질 수 있음)
    const cardDataArr = this.cardListData.tasks;
    this.#taskCards = cardDataArr.map(
      (cardData) => new TaskCard(this.#$taskCardList, cardData)
    );
  }

  // #activate() {
  //   this.#activateAddBtn();
  // }

  // #activateAddBtn() {
  //   const $addBtn = this.#$taskCardList.querySelector(
  //     '.taskcard-list__add-btn'
  //   );
  //   $addBtn.addEventListener('click', () => this.#addNewTaskCard());
  // }

  // #addNewTaskCard() {
  //   const newTaskCard = new Ed();
  //   this.#taskCards.unshift(newTaskCard);
  //   this.#taskCards.forEach((taskCard) => taskCard.render());
  // }
}
