import React, { createContext, useContext, useReducer } from 'react';
import { BoardState, ChessPiece, GameState, PlayerColor, SquareCoord } from '../types/chess';
import { getInitialBoard } from '../utils/boardSetup';
import { calculateLegalMoves } from '../utils/moveCalculator';
import { isKingInCheck, isCheckmate, isStalemate } from '../utils/gameLogic';
import { getChessNotation } from '../utils/notation';

interface ChessContextType {
  state: GameState;
  selectPiece: (position: SquareCoord) => void;
  movePiece: (from: SquareCoord, to: SquareCoord) => void;
  resetGame: () => void;
}

const ChessContext = createContext<ChessContextType | undefined>(undefined);

type ChessAction = 
  | { type: 'SELECT_PIECE'; position: SquareCoord }
  | { type: 'MOVE_PIECE'; from: SquareCoord; to: SquareCoord }
  | { type: 'RESET_GAME' };

const initialState: GameState = {
  board: getInitialBoard(),
  currentPlayer: 'white',
  selectedPiece: null,
  legalMoves: [],
  capturedPieces: {
    white: [],
    black: []
  },
  isCheck: false,
  isCheckmate: false,
  isStalemate: false,
  moves: []
};

function chessReducer(state: GameState, action: ChessAction): GameState {
  switch (action.type) {
    case 'SELECT_PIECE': {
      const [row, col] = action.position;
      const piece = state.board[row][col];
      
      if (!piece || piece.color !== state.currentPlayer) {
        return { ...state, selectedPiece: null, legalMoves: [] };
      }
      
      const legalMoves = calculateLegalMoves(state.board, action.position, state.currentPlayer);
      
      return {
        ...state,
        selectedPiece: action.position,
        legalMoves
      };
    }
    
    case 'MOVE_PIECE': {
      const { from, to } = action;
      const [fromRow, fromCol] = from;
      const [toRow, toCol] = to;
      
      const movingPiece = state.board[fromRow][fromCol];
      const targetPiece = state.board[toRow][toCol];
      
      if (!movingPiece || !state.legalMoves.some(([r, c]) => r === toRow && c === toCol)) {
        return state;
      }
      
      // Create a new board with the move applied
      const newBoard = state.board.map(row => [...row]);
      
      // Handle captured pieces
      const capturedPieces = { ...state.capturedPieces };
      if (targetPiece) {
        capturedPieces[targetPiece.color] = [...capturedPieces[targetPiece.color], targetPiece];
      }
      
      // Update piece hasMoved flag
      const updatedPiece = { 
        ...movingPiece, 
        hasMoved: true 
      };
      
      // Make the move
      newBoard[toRow][toCol] = updatedPiece;
      newBoard[fromRow][fromCol] = null;
      
      // Switch player
      const nextPlayer: PlayerColor = state.currentPlayer === 'white' ? 'black' : 'white';
      
      // Check game status
      const kingInCheck = isKingInCheck(newBoard, nextPlayer);
      const checkmate = kingInCheck && isCheckmate(newBoard, nextPlayer);
      const stalemate = !kingInCheck && isStalemate(newBoard, nextPlayer);
      
      // Add move to history
      const notation = getChessNotation(from, to, movingPiece, targetPiece, kingInCheck, checkmate);
      
      return {
        ...state,
        board: newBoard,
        currentPlayer: nextPlayer,
        selectedPiece: null,
        legalMoves: [],
        capturedPieces,
        isCheck: kingInCheck,
        isCheckmate: checkmate,
        isStalemate: stalemate,
        moves: [...state.moves, notation]
      };
    }
    
    case 'RESET_GAME':
      return initialState;
      
    default:
      return state;
  }
}

export function ChessProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(chessReducer, initialState);
  
  const selectPiece = (position: SquareCoord) => {
    dispatch({ type: 'SELECT_PIECE', position });
  };
  
  const movePiece = (from: SquareCoord, to: SquareCoord) => {
    dispatch({ type: 'MOVE_PIECE', from, to });
  };
  
  const resetGame = () => {
    dispatch({ type: 'RESET_GAME' });
  };
  
  return (
    <ChessContext.Provider value={{ state, selectPiece, movePiece, resetGame }}>
      {children}
    </ChessContext.Provider>
  );
}

export function useChess() {
  const context = useContext(ChessContext);
  if (context === undefined) {
    throw new Error('useChess must be used within a ChessProvider');
  }
  return context;
}