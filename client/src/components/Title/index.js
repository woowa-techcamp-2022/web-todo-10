export default class Title {
  constructor($parent) {
    this.$parent = $parent;
  }

  render() {
    this.$parent.insertAdjacentHTML('beforeend', this.getTitleTemplate());
  }

  getTitleTemplate() {
    return `
            <header>
                <h1 class="header__title">Todo</h1>
            </header> 
        `;
  }
}
