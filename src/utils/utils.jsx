import produce from 'immer';

export const generateMines = (data, height, width, mines) => {
  let minesPlanted = 0;
  while (minesPlanted < mines) {
    let randomX = Math.floor(Math.random() * width);
    let randomY = Math.floor(Math.random() * height);
    if (!data[randomX][randomY].isMine) {
      data[randomX][randomY].isMine = true;
      minesPlanted++;
    }
  }
  return data;
};

export const getNeighbors = (i, j, data, height, width) => {
  let neighbors = [];
  const surround = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];
  surround.forEach(([x, y]) => {
    const newX = i + x;
    const newY = j + y;
    if (newX >= 0 && newX < width && newY >= 0 && newY < height) {
      neighbors.push(data[newX][newY]);
    }
  });

  return neighbors;
};

export const generateNeighbors = (data, height, width) => {
  let dataCopy = data;
  for (let i = 0; i < width; i++) {
    for (let j = 0; j < width; j++) {
      let mines = 0;
      const area = getNeighbors(
        data[i][j].x,
        data[i][j].y,
        data,
        height,
        width
      );
      area.map((value) => {
        if (value.isMine) {
          return mines++;
        }
        return 0;
      });
      if (!mines) {
        dataCopy[i][j].isEmpty = true;
      }
      dataCopy[i][j].neighbors = mines;
    }
  }
  return dataCopy;
};

export const initBoard = (setupData) => {
  const { width: w, height: h, mines: m } = setupData;
  const array2D = Array(w)
    .fill()
    .map((_, indexH) =>
      Array(h)
        .fill()
        .map((_, indexW) => ({
          x: indexH,
          y: indexW,
          isMine: false,
          nNum: 0,
          isEmpty: false,
          isRevealed: false,
          isFlagged: false,
          isBlowed: false,
        }))
    );
  let mutatedArrWithMines = generateMines(array2D, h, w, m);
  let mutatedArrWithNeighbors = generateNeighbors(mutatedArrWithMines, h, w);
  return mutatedArrWithNeighbors;
};

export const showEmptyTiles = (h, w, x, y, data) => {
  let neighbors = getNeighbors(x, y, data, h, w);
  neighbors.map((tile) => {
    if (!tile.isRevealed && (tile.isEmpty || !tile.isMine) && !tile.isFlagged) {
      Object.assign(data[tile.x][tile.y], { isRevealed: true });
      if (tile.isEmpty) {
        showEmptyTiles(h, w, tile.x, tile.y, data);
      }
    }
    return null;
  });
  return data;
};

export const showGrid = (data) => {
  const revealedGrid = produce(data, (draft) =>
    draft.map((row) =>
      row.map((tile) => {
        return { ...tile, isRevealed: true };
      })
    )
  );
  return revealedGrid;
};
