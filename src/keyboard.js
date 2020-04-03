export default class Keyboard {
  constructor() {
    this.pressed = {};
  }

  watch(element) {
    element.addEventListener('keydown', (e) => { this.pressed[e.key] = true; });
    element.addEventListener('keyup', (e) => { this.pressed[e.key] = false; });
  }
}
