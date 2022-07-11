import './index.scss';

export default class Header {
  constructor($parent) {
    this.$parent = $parent;
    this.#makeDOM();
    this.#render();
  }

  #makeDOM() {
    this.$header = document.createElement('header');
    this.$header.className = 'header';
  }

  #render() {
    this.$header.innerHTML = this.#getInnerTemplate();
    this.$parent.append(this.$header);
  }

  #getInnerTemplate() {
    return `
        <h1 class='header__title'>TO-DO LIST</h1>
        <button class='header__menu-btn'></button>
      `;
  }
}
