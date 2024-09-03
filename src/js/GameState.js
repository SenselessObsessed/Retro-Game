export default class GameState {
  static from(object) {
    localStorage.setItem('state', JSON.stringify(object));
    // TODO: create object
    return null;
  }
}
