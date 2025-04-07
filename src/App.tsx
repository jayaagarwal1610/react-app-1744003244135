import React from 'react';
import ChessBoard from './components/ChessBoard';
import GameStatus from './components/GameStatus';
import { ChessProvider } from './context/ChessContext';
import './styles/App.css';

function App() {
  return (
    <div className="App">
      <h1>React Chess</h1>
      <ChessProvider>
        <div className="game-container">
          <ChessBoard />
          <GameStatus />
        </div>
      </ChessProvider>
    </div>
  );
}

export default App;