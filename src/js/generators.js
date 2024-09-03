import Team from './Team';

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

  while (true) {
    const index = random(0, allowedTypes.length);
    const lvl = random(1, maxLevel + 1);
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
  const char = characterGenerator(allowedTypes, maxLevel);
  for (let i = 0; i < characterCount; i += 1) {
    team.add(char.next().value);
  }
  return team;
  // TODO: write logic here
}

const boxSize = 8;

export const generateRandomMainPosition = (howPositions, curretPositions = 0) => {
  const allowedPositions = [];
  for (let i = 0; i < boxSize * boxSize - 1; i += 1) {
    if (i % boxSize === 0 || i % boxSize === 1) allowedPositions.push(i);
  }
  if (curretPositions) {
    for (let i = 0; i < curretPositions.length; i += 1) {
      const idx = allowedPositions.findIndex((item) => item === curretPositions[i]);
      allowedPositions.splice(idx, 1);
    }
  }
  const randomPositions = [];
  for (let i = 0; i < howPositions; i += 1) {
    const num = Math.floor(Math.random() * (allowedPositions.length - 0) + 0);
    randomPositions.push(allowedPositions[num]);
    allowedPositions.splice(num, 1);
  }

  return randomPositions;
};

export const generateRandomOpponentPosition = (howPositions) => {
  const allowedPositions = [];
  for (let i = 0; i < boxSize * boxSize - 1; i += 1) {
    if (i % boxSize === boxSize - 1 || i % boxSize === boxSize - 2) allowedPositions.push(i);
  }
  const randomPositions = [];
  for (let i = 0; i < howPositions; i += 1) {
    const num = Math.floor(Math.random() * (allowedPositions.length - 0) + 0);
    randomPositions.push(allowedPositions[num]);
    allowedPositions.splice(num, 1);
  }

  return randomPositions;
};

export function generateAllowedPositionsToGo(index, type) {
  const leftEdge = index % boxSize === 0;
  const rightEdge = index % boxSize === 7;
  let left = [];
  let right = [];
  let top = [];
  let bottom = [];
  let leftTop = [];
  let rightTop = [];
  let leftBottom = [];
  let rightBottom = [];
  let aroundPerson = [];
  switch (type) {
    case 'magician':
    case 'daemon':
      // LEFT
      if (leftEdge) {
        left = -1;
        leftTop = -1;
        leftBottom = -1;
      } else {
        left = index - 1;
        leftTop = left - boxSize;
        leftBottom = left + boxSize;
      }
      // RIGHT
      if (rightEdge) {
        right = -1;
        rightTop = -1;
        rightBottom = -1;
      } else {
        right = index + 1;
        rightTop = right - boxSize;
        rightBottom = right + boxSize;
      }
      top = index - boxSize;
      bottom = index + boxSize;

      aroundPerson = [left, right, top, bottom, leftTop, rightTop, leftBottom, rightBottom];
      break;
    case 'bowman':
    case 'vampire':
      if (leftEdge) {
        left = [-1];
        leftTop = [-1];
        leftBottom = [-1];
      } else {
        left = [index - 1, index - 2];
        const idxLeft = left.findIndex((item) => item % boxSize === 0);
        if (idxLeft !== -1) {
          const findGroundLeft = [...left];
          left = findGroundLeft.slice(0, idxLeft + 1);
          leftTop = [
            ...left.map((item) => item - boxSize),
            ...left.map((item) => item - boxSize * 2),

          ];
          leftBottom = [
            ...left.map((item) => item + boxSize),
            ...left.map((item) => item + boxSize * 2),
          ];
        } else {
          leftTop = [
            ...left.map((item) => item - boxSize),
            ...left.map((item) => item - boxSize * 2),
          ];
          leftBottom = [
            ...left.map((item) => item + boxSize),
            ...left.map((item) => item + boxSize * 2),
          ];
        }
      }
      if (rightEdge) {
        right = [-1];
        rightTop = [-1];
        rightBottom = [-1];
      } else {
        right = [index + 1, index + 2];
        const idxRight = right.findIndex((item) => item % boxSize === 7);
        if (idxRight !== -1) {
          const findGroundRight = [...right];
          right = findGroundRight.slice(0, idxRight + 1);
          rightTop = [
            ...right.map((item) => item - boxSize),
            ...right.map((item) => item - boxSize * 2),
          ];
          rightBottom = [
            ...right.map((item) => item + boxSize),
            ...right.map((item) => item + boxSize * 2),
          ];
        } else {
          rightTop = [
            ...right.map((item) => item - boxSize),
            ...right.map((item) => item - boxSize * 2),
          ];
          rightBottom = [
            ...right.map((item) => item + boxSize),
            ...right.map((item) => item + boxSize * 2),
          ];
        }
      }
      top = [index - boxSize, index - boxSize * 2];
      bottom = [index + boxSize, index + boxSize * 2];
      aroundPerson = [...left, ...right, ...top, ...bottom, ...leftTop, ...leftBottom, ...rightTop, ...rightBottom];
      break;
    case 'swordsman':
    case 'undead':
      if (leftEdge) {
        left = [-1];
        leftTop = [-1];
        leftBottom = [-1];
      } else {
        left = [index - 1, index - 2, index - 3, index - 4];
        const idxLeft = left.findIndex((item) => item % boxSize === 0);
        if (idxLeft !== -1) {
          const findGroundLeft = [...left];
          left = findGroundLeft.slice(0, idxLeft + 1);
          leftTop = [
            ...left.map((item) => item - boxSize),
            ...left.map((item) => item - boxSize * 2),
            ...left.map((item) => item - boxSize * 3),
            ...left.map((item) => item - boxSize * 4),
          ];
          leftBottom = [
            ...left.map((item) => item + boxSize),
            ...left.map((item) => item + boxSize * 2),
            ...left.map((item) => item + boxSize * 3),
            ...left.map((item) => item + boxSize * 4),
          ];
        } else {
          leftTop = [
            ...left.map((item) => item - boxSize),
            ...left.map((item) => item - boxSize * 2),
            ...left.map((item) => item - boxSize * 3),
            ...left.map((item) => item - boxSize * 4),
          ];
          leftBottom = [
            ...left.map((item) => item + boxSize),
            ...left.map((item) => item + boxSize * 2),
            ...left.map((item) => item + boxSize * 3),
            ...left.map((item) => item + boxSize * 4),
          ];
        }
      }
      if (rightEdge) {
        right = [-1];
        rightTop = [-1];
        rightBottom = [-1];
      } else {
        right = [index + 1, index + 2, index + 3, index + 4];
        const idxRight = right.findIndex((item) => item % boxSize === 7);
        if (idxRight !== -1) {
          const findGroundRight = [...right];
          right = findGroundRight.slice(0, idxRight + 1);
          rightTop = [
            ...right.map((item) => item - boxSize),
            ...right.map((item) => item - boxSize * 2),
            ...right.map((item) => item - boxSize * 3),
            ...right.map((item) => item - boxSize * 4),
          ];
          rightBottom = [
            ...right.map((item) => item + boxSize),
            ...right.map((item) => item + boxSize * 2),
            ...right.map((item) => item + boxSize * 3),
            ...right.map((item) => item + boxSize * 4),
          ];
        } else {
          rightTop = [
            ...right.map((item) => item - boxSize),
            ...right.map((item) => item - boxSize * 2),
            ...right.map((item) => item - boxSize * 3),
            ...right.map((item) => item - boxSize * 4),
          ];
          rightBottom = [
            ...right.map((item) => item + boxSize),
            ...right.map((item) => item + boxSize * 2),
            ...right.map((item) => item + boxSize * 3),
            ...right.map((item) => item + boxSize * 4),
          ];
        }
      }
      top = [index - boxSize, index - boxSize * 2, index - boxSize * 3, index - boxSize * 4];
      bottom = [index + boxSize, index + boxSize * 2, index + boxSize * 3, index + boxSize * 4];
      aroundPerson = [...left, ...right, ...top, ...bottom, ...leftTop, ...leftBottom, ...rightTop, ...rightBottom];
      break;
  }

  const allowAroundPerson = aroundPerson.filter((item) => item >= 0 && item <= 63);

  return allowAroundPerson;
}

export function generateAllowedPositionsToAttack(index, type) {
  const leftEdge = index % boxSize === 0;
  const rightEdge = index % boxSize === 7;
  let left = [];
  let right = [];
  let top = [];
  let bottom = [];
  let leftTop = [];
  let rightTop = [];
  let leftBottom = [];
  let rightBottom = [];
  let aroundPerson = [];
  switch (type) {
    case 'swordsman':
    case 'undead':
      // LEFT
      if (leftEdge) {
        left = -1;
        leftTop = -1;
        leftBottom = -1;
      } else {
        left = index - 1;
        leftTop = left - boxSize;
        leftBottom = left + boxSize;
      }
      // RIGHT
      if (rightEdge) {
        right = -1;
        rightTop = -1;
        rightBottom = -1;
      } else {
        right = index + 1;
        rightTop = right - boxSize;
        rightBottom = right + boxSize;
      }
      top = index - boxSize;
      bottom = index + boxSize;

      aroundPerson = [left, right, top, bottom, leftTop, rightTop, leftBottom, rightBottom];
      break;
    case 'bowman':
    case 'vampire':
      if (leftEdge) {
        left = [-1];
        leftTop = [-1];
        leftBottom = [-1];
      } else {
        left = [index - 1, index - 2];
        const idxLeft = left.findIndex((item) => item % boxSize === 0);
        if (idxLeft !== -1) {
          const findGroundLeft = [...left];
          left = findGroundLeft.slice(0, idxLeft + 1);
          leftTop = [
            ...left.map((item) => item - boxSize),
            ...left.map((item) => item - boxSize * 2),

          ];
          leftBottom = [
            ...left.map((item) => item + boxSize),
            ...left.map((item) => item + boxSize * 2),
          ];
        } else {
          leftTop = [
            ...left.map((item) => item - boxSize),
            ...left.map((item) => item - boxSize * 2),
          ];
          leftBottom = [
            ...left.map((item) => item + boxSize),
            ...left.map((item) => item + boxSize * 2),
          ];
        }
      }
      if (rightEdge) {
        right = [-1];
        rightTop = [-1];
        rightBottom = [-1];
      } else {
        right = [index + 1, index + 2];
        const idxRight = right.findIndex((item) => item % boxSize === 7);
        if (idxRight !== -1) {
          const findGroundRight = [...right];
          right = findGroundRight.slice(0, idxRight + 1);
          rightTop = [
            ...right.map((item) => item - boxSize),
            ...right.map((item) => item - boxSize * 2),
          ];
          rightBottom = [
            ...right.map((item) => item + boxSize),
            ...right.map((item) => item + boxSize * 2),
          ];
        } else {
          rightTop = [
            ...right.map((item) => item - boxSize),
            ...right.map((item) => item - boxSize * 2),
          ];
          rightBottom = [
            ...right.map((item) => item + boxSize),
            ...right.map((item) => item + boxSize * 2),
          ];
        }
      }
      top = [index - boxSize, index - boxSize * 2];
      bottom = [index + boxSize, index + boxSize * 2];
      aroundPerson = [...left, ...right, ...top, ...bottom, ...leftTop, ...leftBottom, ...rightTop, ...rightBottom];
      break;
    case 'magician':
    case 'daemon':
      if (leftEdge) {
        left = [-1];
        leftTop = [-1];
        leftBottom = [-1];
      } else {
        left = [index - 1, index - 2, index - 3, index - 4];
        const idxLeft = left.findIndex((item) => item % boxSize === 0);
        if (idxLeft !== -1) {
          const findGroundLeft = [...left];
          left = findGroundLeft.slice(0, idxLeft + 1);
          leftTop = [
            ...left.map((item) => item - boxSize),
            ...left.map((item) => item - boxSize * 2),
            ...left.map((item) => item - boxSize * 3),
            ...left.map((item) => item - boxSize * 4),
          ];
          leftBottom = [
            ...left.map((item) => item + boxSize),
            ...left.map((item) => item + boxSize * 2),
            ...left.map((item) => item + boxSize * 3),
            ...left.map((item) => item + boxSize * 4),
          ];
        } else {
          leftTop = [
            ...left.map((item) => item - boxSize),
            ...left.map((item) => item - boxSize * 2),
            ...left.map((item) => item - boxSize * 3),
            ...left.map((item) => item - boxSize * 4),
          ];
          leftBottom = [
            ...left.map((item) => item + boxSize),
            ...left.map((item) => item + boxSize * 2),
            ...left.map((item) => item + boxSize * 3),
            ...left.map((item) => item + boxSize * 4),
          ];
        }
      }
      if (rightEdge) {
        right = [-1];
        rightTop = [-1];
        rightBottom = [-1];
      } else {
        right = [index + 1, index + 2, index + 3, index + 4];
        const idxRight = right.findIndex((item) => item % boxSize === 7);
        if (idxRight !== -1) {
          const findGroundRight = [...right];
          right = findGroundRight.slice(0, idxRight + 1);
          rightTop = [
            ...right.map((item) => item - boxSize),
            ...right.map((item) => item - boxSize * 2),
            ...right.map((item) => item - boxSize * 3),
            ...right.map((item) => item - boxSize * 4),
          ];
          rightBottom = [
            ...right.map((item) => item + boxSize),
            ...right.map((item) => item + boxSize * 2),
            ...right.map((item) => item + boxSize * 3),
            ...right.map((item) => item + boxSize * 4),
          ];
        } else {
          rightTop = [
            ...right.map((item) => item - boxSize),
            ...right.map((item) => item - boxSize * 2),
            ...right.map((item) => item - boxSize * 3),
            ...right.map((item) => item - boxSize * 4),
          ];
          rightBottom = [
            ...right.map((item) => item + boxSize),
            ...right.map((item) => item + boxSize * 2),
            ...right.map((item) => item + boxSize * 3),
            ...right.map((item) => item + boxSize * 4),
          ];
        }
      }
      top = [index - boxSize, index - boxSize * 2, index - boxSize * 3, index - boxSize * 4];
      bottom = [index + boxSize, index + boxSize * 2, index + boxSize * 3, index + boxSize * 4];
      aroundPerson = [...left, ...right, ...top, ...bottom, ...leftTop, ...leftBottom, ...rightTop, ...rightBottom];
      break;
  }

  const allowAroundPerson = aroundPerson.filter((item) => item >= 0 && item <= 63);

  return allowAroundPerson;
}
