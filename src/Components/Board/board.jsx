import React, { useState } from 'react';
import './style.css';
import { initBoard, showEmptyTiles, showGrid } from '../../utils/utils';
import Tile from '../Tile/tile';
import produce from 'immer';

const Board = ({ setupData }) => {
  const [gameState, setGameState] = useState('Играй как в последний раз!');
  const [mineCount, setMineCount] = useState(setupData.mines);
  const [grid, setGrid] = useState(() => initBoard(setupData));
  const [time, setTime] = useState(0);
  const [interv, setInterv] = useState();

  const startTimer = () => {
    runTimer();
    setInterv(setInterval(runTimer, 1000));
  };
  let updatedS = time;

  const runTimer = () => {
    updatedS++;
    setTime(updatedS);
  };

  const stopTimer = () => {
    clearInterval(interv);
  };
  const onLeftClick = (event, x, y) => {
    event.preventDefault();
    startTimer();
    if (grid[x][y].isRevealed || grid[x][y].isFlagged) return;
    const updatedGrid = produce(grid, (draft) => {
      Object.assign(draft[x][y], { isRevealed: true });
      if (draft[x][y].isEmpty) {
        showEmptyTiles(setupData.height, setupData.width, x, y, draft);
      }
    });
    if (updatedGrid[x][y].isMine) {
      const updatedGrid = produce(grid, (draft) => {
        Object.assign(draft[x][y], { isBlowed: true });
      });
      const revealedGrid = showGrid(updatedGrid);
      setGrid(revealedGrid);
      console.log(updatedGrid[x][y]);
      return setGameState('Не отчаивайся!');
    }

    const hiddenGrid = updatedGrid.flat().filter((tile) => !tile.isRevealed);
    if (hiddenGrid.length === setupData.mines) {
      setGameState('Ты победитель по жизни!');
      showGrid(updatedGrid);
    }
    setGrid(updatedGrid);
  };
  const onRightClick = (event, x, y) => {
    event.preventDefault();
    let mineCountPlaceHolder = mineCount;
    if (grid[x][y].isRevealed) return;
    const updatedGrid = produce(grid, (draft) => {
      draft[x][y].isFlagged
        ? (mineCountPlaceHolder += 1)
        : (mineCountPlaceHolder -= 1);
      if (mineCountPlaceHolder >= 0 && mineCountPlaceHolder <= mineCount + 1) {
        draft[x][y].isFlagged = !draft[x][y].isFlagged;
        setMineCount(mineCountPlaceHolder);
      }
    });

    setGrid(updatedGrid);
  };
  const resetGame = (e, setupData) => {
    e.preventDefault();
    setGameState('Game ON');
    setGrid(initBoard(setupData));
    setMineCount(setupData.mines);
  };

  return (
    <>
      <div className="header">
        <div className="counter">{mineCount.toString().padStart(3, '0')}</div>
        <button
          className={gameState === 'Не отчаивайся!' ? 'fail' : 'smile'}
          onClick={(e) => resetGame(e, setupData)}
        ></button>
        <div className="counter">{time.toString().padStart(3, '0')}</div>
      </div>
      <h2>{gameState}</h2>

      <div className="board">
        {grid.map((row, i) =>
          row.map((col, j) => (
            <Tile
              onLeftClick={(e, i, j) => onLeftClick(e, i, j)}
              onRightClick={(e, i, j) => onRightClick(e, i, j)}
              key={`${i}-${j}`}
              col={col}
              i={i}
              j={j}
            />
          ))
        )}
      </div>
    </>
  );
};

export default Board;
