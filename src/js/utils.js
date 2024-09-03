/**
 * @todo
 * @param index - индекс поля
 * @param boardSize - размер квадратного поля (в длину или ширину)
 * @returns строка - тип ячейки на поле:
 *
 * top-left
 * top-right
 * top
 * bottom-left
 * bottom-right
 * bottom
 * right
 * left
 * center
 *
 * @example
 * ```js
 * calcTileType(0, 8); // 'top-left'
 * calcTileType(1, 8); // 'top'
 * calcTileType(63, 8); // 'bottom-right'
 * calcTileType(7, 7); // 'left'
 * ```
 * */
export function calcTileType(index, boardSize) {
  const size = boardSize;

  const top = index < size;
  const bottom = index < size * size && index > size * size - size;
  const left = index % size === 0;
  const right = index % size === size - 1;

  switch (index) {
    case 0:
      return 'top-left';
    case size - 1:
      return 'top-right';
    case size * size - 1:
      return 'bottom-right';
    case size * size - size:
      return 'bottom-left';
    default:
  }

  if (top) return 'top';
  if (bottom) return 'bottom';
  if (left) return 'left';
  if (right) return 'right';

  // TODO: ваш код будет тут
  return 'center';
}

export function calcHealthLevel(health) {
  if (health < 15) {
    return 'critical';
  }

  if (health < 50) {
    return 'normal';
  }

  return 'high';
}
