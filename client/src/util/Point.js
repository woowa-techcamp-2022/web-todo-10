export default class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  get() {
    return [this.x, this.y];
  }

  diff(point) {
    return [this.x - point.x, this.y - point.y];
  }
}
