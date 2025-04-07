import React from 'react';
import '../styles/Square.css';

interface SquareProps {
  isLight: boolean;
  isSelected: boolean;
  isLegalMove: boolean;
  onClick: () => void;
  children?: React.ReactNode;
}

const Square: React.FC<SquareProps> = ({ 
  isLight, 
  isSelected, 
  isLegalMove, 
  onClick, 
  children 
}) => {
  let className = "square";
  className += isLight ? " light" : " dark";
  if (isSelected) className += " selected";
  if (isLegalMove) className += " legal-move";
  
  return (
    <div className={className} onClick={onClick}>
      {children}
    </div>
  );
};

export default Square;