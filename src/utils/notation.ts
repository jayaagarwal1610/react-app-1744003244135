import { ChessPiece, SquareCoord } from '../types/chess';

export function getChessNotation(
  from: SquareCoord,
  to: SquareCoord,
  piece: ChessPiece,
  capturedPiece: ChessPiece | null,
  isCheck: boolean,
  isCheckmate: boolean
): string {
  const [fromRow, fromCol] = from;
  const [toRow, toCol] = to;
  
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];
  
  const fromSquare = `${files[fromCol]}${ranks[fromRow]}`;
  const toSquare = `${files[toCol]}${ranks[toRow]}`;
  
  let notation = '';
  
  // Add piece symbol (except for pawns)
  if (piece.type !== 'pawn') {
    switch (piece.type) {
      case 'knight': notation += 'N'; break;
      case 'bishop': notation += 'B'; break;
      case 'rook': notation += 'R'; break;
      case 'queen': notation += 'Q'; break;
      case 'king': notation += 'K'; break;
    }
  }
  
  // Add capture symbol
  if (capturedPiece) {
    if (piece.type === 'pawn') {
      notation += fromSquare[0]; // Add file for pawn captures
    }
    notation += 'x';
  }
  
  // Add destination square
  notation += toSquare;
  
  // Add check or checkmate symbol
  if (isCheckmate) {
    notation += '#';
  } else if (isCheck) {
    notation += '+';
  }
  
  return notation;
}