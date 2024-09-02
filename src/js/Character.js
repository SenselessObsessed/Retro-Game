/**
 * Базовый класс, от которого наследуются классы персонажей
 * @property level - уровень персонажа, от 1 до 4
 * @property attack - показатель атаки
 * @property defence - показатель защиты
 * @property health - здоровье персонажа
 * @property type - строка с одним из допустимых значений:
 * swordsman
 * bowman
 * magician
 * daemon
 * undead
 * vampire
 */
export default class Character {
  constructor(level, type = 'generic') {
    switch(level) {
      case 2:
        this.levelUp()
      case 3:
        this.levelUp()
      case 4:
        this.levelUp()
    }
    this.level = level;
    this.attack = 0;
    this.defence = 0;
    this.health = 50;
    this.type = type;
    // TODO: выбросите исключение, если кто-то использует "new Character()"
  }

  levelUp() {
    this.level += 1;
    const attackBefore = this.attack;
    this.attack = Math.max(attackBefore, attackBefore * (80 + this.health) / 100);
    this.health <= 20 ? this.health += 80 : this.health = 100;
  }
}
