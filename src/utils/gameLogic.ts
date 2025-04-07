import { BoardState, PlayerColor, SquareCoord } from '../types/chess';
import { calculateLegalMoves } from './moveCalculator';

// Modified to use local function to prevent circular dependency
function calculateRawMoves(board: BoardState, position: SquareCoord, color: PlayerColor): SquareCoord[] {
  const [row, col] = position;
  const piece = board[row][col];
  
  if (!piece || piece.color !== color) {
    return [];
  }
  
  switch (piece.type) {
    case 'pawn':
      return getPawnMoves(board, position, color);
    case 'rook':
      return getRookMoves(board, position, color);
    case 'knight':
      return getKnightMoves(board, position, color);
    case 'bishop':
      return getBishopMoves(board, position, color);
    case 'queen':
      return [...getRookMoves(board, position, color), ...getBishopMoves(board, position, color)];
    case 'king':
      return getKingMoves(board, position, color);
    default:
      return [];
  }
}

export function isKingInCheck(board: BoardState, playerColor: PlayerColor): boolean {
  // Find king position
  let kingPos: SquareCoord | null = null;
  
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.type === 'king' && piece.color === playerColor) {
        kingPos = [row, col];
        break;
      }
    }
    if (kingPos) break;
  }
  
  if (!kingPos) return false; // Should never happen in a valid game
  
  // Check if any enemy piece can attack the king
  const opponentColor = playerColor === 'white' ? 'black' : 'white';
  
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.color === opponentColor) {
        const attackingMoves = calculateRawMoves(board, [row, col], opponentColor);
        if (attackingMoves.some(([r, c]) => r === kingPos![0] && c === kingPos![1])) {
          return true;
        }
      }
    }
  }
  
  return false;
}

export function isCheckmate(board: BoardState, playerColor: PlayerColor): boolean {
  // If the king is not in check, it's not checkmate
  if (!isKingInCheck(board, playerColor)) {
    return false;
  }
  
  // Check if any piece can make a move that gets the king out of check
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.color === playerColor) {
        const legalMoves = calculateLegalMoves(board, [row, col], playerColor);
        if (legalMoves.length > 0) {
          return false;
        }
      }
    }
  }
  
  return true;
}

export function isStalemate(board: BoardState, playerColor: PlayerColor): boolean {
  // If the king is in check, it's not stalemate
  if (isKingInCheck(board, playerColor)) {
    return false;
  }
  
  // Check if the player has any legal moves
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.color === playerColor) {
        const legalMoves = calculateLegalMoves(board, [row, col], playerColor);
        if (legalMoves.length > 0) {
          return false;
        }
      }
    }
  }
  
  return true;
}

// Add these additional functions that are needed by calculateRawMoves
function getPawnMoves(board: BoardState, [row, col]: SquareCoord, color: PlayerColor): SquareCoord[] {
  const moves: SquareCoord[] = [];
  const direction = color === 'white' ? -1 : 1;
  const startingRow = color === 'white' ? 6 : 1;
  
  // Move forward one square
  if (
    row + direction >= 0 && 
    row + direction < 8 && 
    !board[row + direction][col]
  ) {
    moves.push([row + direction, col]);
    
    // Move forward two squares from starting position
    if (
      row === startingRow && 
      !board[row + 2 * direction][col]
    ) {
      moves.push([row + 2 * direction, col]);
    }
  }
  
  // Capture diagonally
  for (const offset of [-1, 1]) {
    if (
      row + direction >= 0 && 
      row + direction < 8 && 
      col + offset >= 0 && 
      col + offset < 8
    ) {
      const target = board[row + direction][col + offset];
      if (target && target.color !== color) {
        moves.push([row + direction, col + offset]);
      }
    }
  }
  
  return moves;
}

function getRookMoves(board: BoardState, [row, col]: SquareCoord, color: PlayerColor): SquareCoord[] {
  const moves: SquareCoord[] = [];
  const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]]; // right, down, left, up
  
  for (const [dx, dy] of directions) {
    let x = row + dx;
    let y = col + dy;
    
    while (x >= 0 && x < 8 && y >= 0 && y < 8) {
      const target = board[x][y];
      
      if (!target) {
        moves.push([x, y]);
      } else {
        if (target.color !== color) {
          moves.push([x, y]);
        }
        break; // Can't move past a piece
      }
      
      x += dx;
      y += dy;
    }
  }
  
  return moves;
}

function getKnightMoves(board: BoardState, [row, col]: SquareCoord, color: PlayerColor): SquareCoord[] {
  const moves: SquareCoord[] = [];
  const knightMoves = [
    [-2, -1], [-2, 1], [-1, -2], [-1, 2],
    [1, -2], [1, 2], [2, -1], [2, 1]
  ];
  
  for (const [dx, dy] of knightMoves) {
    const x = row + dx;
    const y = col + dy;
    
    if (x >= 0 && x < 8 && y >= 0 && y < 8) {
      const target = board[x][y];
      
      if (!target || target.color !== color) {
        moves.push([x, y]);
      }
    }
  }
  
  return moves;
}

function getBishopMoves(board: BoardState, [row, col]: SquareCoord, color: PlayerColor): SquareCoord[] {
  const moves: SquareCoord[] = [];
  const directions = [[1, 1], [1, -1], [-1, 1], [-1, -1]]; // down-right, down-left, up-right, up-left
  
  for (const [dx, dy] of directions) {
    let x = row + dx;
    let y = col + dy;
    
    while (x >= 0 && x < 8 && y >= 0 && y < 8) {
      const target = board[x][y];
      
      if (!target) {
        moves.push([x, y]);
      } else {
        if (target.color !== color) {
          moves.push([x, y]);
        }
        break; // Can't move past a piece
      }
      
      x += dx;
      y += dy;
    }
  }
  
  return moves;
}

function getKingMoves(board: BoardState, [row, col]: SquareCoord, color: PlayerColor): SquareCoord[] {
  const moves: SquareCoord[] = [];
  const kingMoves = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1],           [0, 1],
    [1, -1],  [1, 0],  [1, 1]
  ];
  
  for (const [dx, dy] of kingMoves) {
    const x = row + dx;
    const y = col + dy;
    
    if (x >= 0 && x < 8 && y >= 0 && y < 8) {
      const target = board[x][y];
      
      if (!target || target.color !== color) {
        moves.push([x, y]);
      }
    }
  }
  
  return moves;
}