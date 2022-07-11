class TaskBoard {
  constructor($parent) {
    this.$parent = $parent;
  }

  render() {
    const taskBoardTemplate = this.#getTemplate();
  }

  #getTemplate() {}
}
