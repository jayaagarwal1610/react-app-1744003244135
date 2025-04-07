import React from 'react';
import { ChessPiece, PlayerColor } from '../types/chess';
import '../styles/CapturedPieces.css';

interface CapturedPiecesProps {
  pieces: ChessPiece[];
  color: PlayerColor;
}

const CapturedPieces: React.FC<CapturedPiecesProps> = ({ pieces, color }) => {
  if (pieces.length === 0) {
    return null;
  }
  
  const getPieceValue = (piece: ChessPiece): number => {
    switch (piece.type) {
      case 'pawn': return 1;
      case 'knight': return 3;
      case 'bishop': return 3;
      case 'rook': return 5;
      case 'queen': return 9;
      case 'king': return 0;
    }
  };
  
  // Sort pieces by value
  const sortedPieces = [...pieces].sort((a, b) => getPieceValue(b) - getPieceValue(a));
  
  return (
    <div className={`captured-pieces ${color}`}>
      <h3>Captured {color} pieces:</h3>
      <div className="pieces-container">
        {sortedPieces.map((piece, index) => (
          <div key={index} className="captured-piece">
            {piece.type === 'pawn' ? '♟' :
             piece.type === 'rook' ? '♜' :
             piece.type === 'knight' ? '♞' : 
             piece.type === 'bishop' ? '♝' :
             piece.type === 'queen' ? '♛' : '♚'}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CapturedPieces;