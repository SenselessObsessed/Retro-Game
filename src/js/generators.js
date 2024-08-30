import Team from "./Team";

/**
 * Формирует экземпляр персонажа из массива allowedTypes со
 * случайным уровнем от 1 до maxLevel
 *
 * @param allowedTypes массив классов
 * @param maxLevel максимальный возможный уровень персонажа
 * @returns генератор, который при каждом вызове
 * возвращает новый экземпляр класса персонажа
 *
 */
export function* characterGenerator(allowedTypes, maxLevel) {
  const random = (min, max) => Math.floor(Math.random() * (max - min) + min);
  
  while(true) {
    const index = random(0, allowedTypes.length);
    const lvl = random(0, maxLevel + 1);
    yield new allowedTypes[index](lvl);
  }
  // TODO: write logic here
}

/**
 * Формирует массив персонажей на основе characterGenerator
 * @param allowedTypes массив классов
 * @param maxLevel максимальный возможный уровень персонажа
 * @param characterCount количество персонажей, которое нужно сформировать
 * @returns экземпляр Team, хранящий экземпляры персонажей. Количество персонажей в команде - characterCount
 * */
export function generateTeam(allowedTypes, maxLevel, characterCount) {
  const team = new Team();
  const char = characterGenerator(allowedTypes, maxLevel)
  for (let i = 0; i < characterCount; i += 1) {

    team.add(char.next().value)
  }
  return team;
  // TODO: write logic here
}
