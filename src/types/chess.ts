export type PieceType = 'pawn' | 'rook' | 'knight' | 'bishop' | 'queen' | 'king';
export type PlayerColor = 'white' | 'black';
export type SquareCoord = [number, number];

export interface ChessPiece {
  type: PieceType;
  color: PlayerColor;
  hasMoved?: boolean;
}

export type BoardState = (ChessPiece | null)[][];

export interface GameState {
  board: BoardState;
  currentPlayer: PlayerColor;
  selectedPiece: SquareCoord | null;
  legalMoves: SquareCoord[];
  capturedPieces: {
    white: ChessPiece[];
    black: ChessPiece[];
  };
  isCheck: boolean;
  isCheckmate: boolean;
  isStalemate: boolean;
  moves: string[];
}