import React from 'react';
import Square from './Square';
import ChessPiece from './ChessPiece';
import { useChess } from '../context/ChessContext';
import '../styles/ChessBoard.css';

const ChessBoard: React.FC = () => {
  const { state, selectPiece, movePiece } = useChess();
  const { board, selectedPiece, legalMoves } = state;
  
  const handleSquareClick = (row: number, col: number) => {
    if (selectedPiece) {
      const [selectedRow, selectedCol] = selectedPiece;
      
      // If clicking on the same square, deselect
      if (selectedRow === row && selectedCol === col) {
        selectPiece([-1, -1]); // Deselect
        return;
      }
      
      // Check if the move is legal
      const isLegalMove = legalMoves.some(([r, c]) => r === row && c === col);
      
      if (isLegalMove) {
        movePiece([selectedRow, selectedCol], [row, col]);
      } else {
        // If clicked on another piece of same color, select that instead
        const piece = board[row][col];
        if (piece && piece.color === state.currentPlayer) {
          selectPiece([row, col]);
        }
      }
    } else {
      selectPiece([row, col]);
    }
  };
  
  const isSelected = (row: number, col: number): boolean => {
    return selectedPiece !== null && selectedPiece[0] === row && selectedPiece[1] === col;
  };
  
  const isLegalMove = (row: number, col: number): boolean => {
    return legalMoves.some(([r, c]) => r === row && c === col);
  };
  
  return (
    <div className="chess-board">
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="board-row">
          {row.map((piece, colIndex) => {
            const isLight = (rowIndex + colIndex) % 2 === 0;
            const squareSelected = isSelected(rowIndex, colIndex);
            const legalMove = isLegalMove(rowIndex, colIndex);
            
            return (
              <Square
                key={colIndex}
                isLight={isLight}
                isSelected={squareSelected}
                isLegalMove={legalMove}
                onClick={() => handleSquareClick(rowIndex, colIndex)}
              >
                {piece && <ChessPiece piece={piece} />}
              </Square>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default ChessBoard;