import './index.scss';

export default class Title {
  constructor($parent) {
    this.$parent = $parent;
  }

  render() {
    this.$parent.insertAdjacentHTML('afterbegin', this.#getTitleTemplate());
  }

  #getTitleTemplate() {
    return `
            <header class='header'>
                <h1 class='header__title'>TO-DO LIST</h1>
            </header> 
        `;
  }
}
