import React from 'react';
import { useChess } from '../context/ChessContext';
import CapturedPieces from './CapturedPieces';
import MoveHistory from './MoveHistory';
import '../styles/GameStatus.css';

const GameStatus: React.FC = () => {
  const { state, resetGame } = useChess();
  const { currentPlayer, isCheck, isCheckmate, isStalemate, capturedPieces, moves } = state;
  
  let statusMessage = `Current turn: ${currentPlayer}`;
  
  if (isCheckmate) {
    statusMessage = `Checkmate! ${currentPlayer === 'white' ? 'Black' : 'White'} wins!`;
  } else if (isStalemate) {
    statusMessage = "Stalemate! The game is a draw.";
  } else if (isCheck) {
    statusMessage = `${currentPlayer} is in check!`;
  }
  
  return (
    <div className="game-status">
      <div className="status-message">{statusMessage}</div>
      
      <div className="captured-pieces-container">
        <CapturedPieces pieces={capturedPieces.white} color="white" />
        <CapturedPieces pieces={capturedPieces.black} color="black" />
      </div>
      
      <MoveHistory moves={moves} />
      
      <button className="reset-button" onClick={resetGame}>
        New Game
      </button>
    </div>
  );
};

export default GameStatus;