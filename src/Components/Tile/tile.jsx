import React from 'react';
import './style.css';
import Flag from '../../images/flag.png';
import Bomb from '../../images/openedBomb.png';
import One from '../../images/1.png';
import Two from '../../images/2.png';
import Three from '../../images/3.png';
import Four from '../../images/4.png';
import Five from '../../images/5.png';
import Six from '../../images/6.png';
import Seven from '../../images/7.png';
import Eight from '../../images/8.png';
import BlowedBomb from '../../images/blowedBomb.png';

const Tile = ({ col, i, j, onLeftClick, onRightClick }) => {
  const getValue = (tileData) => {
    const { isMine, isRevealed, neighbors, isFlagged, isBlowed } = tileData;
    if (!isRevealed)
      return isFlagged ? <img className="flag" src={Flag} alt="flag" /> : '';
    if (isMine && !isBlowed)
      return <img className="bomb" src={Bomb} alt="bomb" />;
    if (isBlowed) return <img className="bomb" src={BlowedBomb} alt="bomb" />;
    if (neighbors) {
      switch (neighbors) {
        case 1:
          return <img className="neighbors" src={One} alt="one" />;
        case 2:
          return <img className="neighbors" src={Two} alt="two" />;
        case 3:
          return <img className="neighbors" src={Three} alt="three" />;
        case 4:
          return <img className="neighbors" src={Four} alt="four" />;
        case 5:
          return <img className="neighbors" src={Five} alt="five" />;
        case 6:
          return <img className="neighbors" src={Six} alt="six" />;
        case 7:
          return <img className="neighbors" src={Seven} alt="seven" />;
        case 8:
          return <img className="neighbors" src={Eight} alt="eight" />;
        default:
          break;
      }
    }
  };

  return (
    <div
      onClick={(e) => onLeftClick(e, i, j)}
      onContextMenu={(e) => onRightClick(e, i, j)}
      className={col.isRevealed ? 'opened' : 'tile'}
      key={`${i}-${j}`}
    >
      {getValue(col)}
    </div>
  );
};

export default Tile;
