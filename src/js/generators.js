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

const boxSize = 8;

export const generateRandomMainPosition = (howPositions) => {
  const allowedPositions = [];
  for(let i = 0; i < boxSize * boxSize - 1; i += 1) {
    if(i % boxSize === 0 || i % boxSize === 1) allowedPositions.push(i)
  }
  const randomPositions = [];
  for(let i = 0; i < howPositions; i += 1) {
    const num = Math.floor(Math.random() * (allowedPositions.length - 0) + 0);
    randomPositions.push(allowedPositions[num]);
    allowedPositions.splice(num, 1);
  }

  return randomPositions;
};

export const generateRandomOpponentPosition = (howPositions) => {
  const allowedPositions = [];
  for(let i = 0; i < boxSize * boxSize - 1; i += 1) {
    if(i % boxSize === boxSize - 1 || i % boxSize === boxSize - 2) allowedPositions.push(i)
  }
  const randomPositions = [];
  for(let i = 0; i < howPositions; i += 1) {
    const num = Math.floor(Math.random() * (allowedPositions.length - 0) + 0);
    randomPositions.push(allowedPositions[num]);
    allowedPositions.splice(num, 1);
  }

  return randomPositions;
};

export function generateAllowedPositionsToGo(index, type) {
  const leftEdge = index % 8 === 0;
  const rightEdge = index % 8 === 8;
  let left = [];
  let right = [];
  let top = [];
  let bottom = [];
  let leftTop = [];
  let rightTop = [];
  let leftBottom = [];
  let rightBottom = [];
  let aroundPerson = [];
  switch(type){
    case 'magician':
    case 'daemon':
      //LEFT
      if(leftEdge) {
        left =  -1;
        leftTop = -1;
        leftBottom = -1;
      } else {
        left = index - 1;
        leftTop = left - 8;
        leftBottom = left + 8;
      }
      //RIGHT
      if(rightEdge) {
        right = -1;
        rightTop = -1;
        rightBottom = -1;
      } else {
        right = index + 1;
        rightTop = right - 8;
        rightBottom = right + 8;
      }
      top = index - 8;
      bottom = index + 8;

      aroundPerson = [left, right, top, bottom, leftTop, rightTop, leftBottom, rightBottom];
    break
    case 'bowman':
    case 'vampire':
      left = [index - 1, index - 2];
      right = [index + 1, index + 2];
      top = [index - 8, index - 8 * 2];
      bottom = [index + 8, index + 8 * 2];
      // topLeft = top.map(item => item - 1);
      // topRight = top.map(item => item + 1);
      // bottomLeft = bottom.map(item => item - 1);
      // bottomRight = bottom.map(item => item + 1);
      aroundPerson = [...left, ...right, ...top, ...bottom];
    break
    case 'swordsman':
    case 'undead':
      left = [index - 1, index - 2, index - 3, index - 4];
      right = [index + 1, index + 2, index + 3, index + 4];
      top = [index - 8, index - 8 * 2, index - 8 * 3, index - 8 * 4];
      bottom = [index + 8, index + 8 * 2, index + 8 * 3, index + 8 * 4]
      topLeft = top.map(item => item - 1);
      topRight = top.map(item => item + 1);
      bottomLeft = bottom.map(item => item - 1);
      bottomRight = bottom.map(item => item + 1);
      aroundPerson = [...left, ...right, ...top, ...bottom, ...topLeft, ...topRight, ...bottomLeft, ...bottomRight];
    break
  }

  const allowAroundPerson = aroundPerson.filter(item => item >= 0 && item <= 63);

  return allowAroundPerson;
}
