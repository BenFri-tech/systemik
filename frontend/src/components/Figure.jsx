import React, { useState, useRef } from 'react';
import Draggable from 'react-draggable';
import './Figure.css'; // Importiere die CSS-Datei

const Figure = ({ initialPosition, onDragStop, id, width, height, onClick, isSelectedForLine }) => {
  const [text, setText] = useState('');
  const [currentWidth, setCurrentWidth] = useState(width);
  const [currentHeight, setCurrentHeight] = useState(height);
  const nodeRef = useRef(null);
  const isResizing = useRef(false);

  const handleMouseDown = (e) => {
    e.stopPropagation();
    isResizing.current = true;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e) => {
    if (!isResizing.current) return;
    setCurrentWidth(prevWidth => Math.max(50, prevWidth + e.movementX));
    setCurrentHeight(prevHeight => Math.max(50, prevHeight + e.movementY));
  };

  const handleMouseUp = () => {
    isResizing.current = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  const handleClick = () => {
    onClick(id);
  };

  return (
    <Draggable
      bounds="parent"
      defaultPosition={initialPosition}
      onStop={(e, data) => onDragStop(id, { x: data.x, y: data.y }, currentWidth, currentHeight)}
      nodeRef={nodeRef}
    >
      <div
        ref={nodeRef}
        onClick={handleClick}
        className={`figure-container ${isSelectedForLine ? 'selected-for-line' : ''}`}
        style={{
          width: currentWidth,
          height: currentHeight,
        }}
      >
        {/* Simple representation of a human figure */}
        <div className="figure-head"></div>
        <div className="figure-body"></div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onMouseDown={(e) => e.stopPropagation()}
          placeholder="Text eingeben"
          className="figure-text-area"
        />
        {/* Resize handle */}
        <div
          onMouseDown={handleMouseDown}
          className="resize-handle"
        />
      </div>
    </Draggable>
  );
};

export default Figure; 