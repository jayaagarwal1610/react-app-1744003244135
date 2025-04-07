import React from 'react';
import '../styles/MoveHistory.css';

interface MoveHistoryProps {
  moves: string[];
}

const MoveHistory: React.FC<MoveHistoryProps> = ({ moves }) => {
  if (moves.length === 0) {
    return null;
  }
  
  // Group moves by pairs for display (white and black moves)
  const moveRows = [];
  for (let i = 0; i < moves.length; i += 2) {
    moveRows.push({
      moveNumber: Math.floor(i / 2) + 1,
      whiteMove: moves[i],
      blackMove: i + 1 < moves.length ? moves[i + 1] : ''
    });
  }
  
  return (
    <div className="move-history">
      <h3>Move History</h3>
      <div className="moves-container">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>White</th>
              <th>Black</th>
            </tr>
          </thead>
          <tbody>
            {moveRows.map((row) => (
              <tr key={row.moveNumber}>
                <td>{row.moveNumber}.</td>
                <td>{row.whiteMove}</td>
                <td>{row.blackMove}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MoveHistory;