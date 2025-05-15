// components/AppleBoard.jsx
import React, { useEffect, useRef } from 'react';
import AppleCell from './AppleCell';
import './AppleBoard.css';

export default function AppleBoard({
  apples,
  selected,
  setSelected,
  isDragging,
  setIsDragging,
  disabled,
  onMouseUp
}) {
  const canvasRef = useRef(null);
  const boardRef = useRef(null);

  // 모바일 터치 드래그 종료 대응
  useEffect(() => {
    const handleTouchEnd = () => {
      setIsDragging(false);
      if (onMouseUp) onMouseUp();
    };

    window.addEventListener('touchend', handleTouchEnd);
    return () => {
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [onMouseUp]);

  useEffect(() => {
    drawLines();
  }, [selected]);

  const handleMouseDown = (index) => {
    if (disabled) return;
    setIsDragging(true);
    setSelected([index]);
  };

  const handleMouseEnter = (index) => {
    if (!isDragging || selected.includes(index) || disabled) return;
    setSelected(prev => [...prev, index]);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (onMouseUp) onMouseUp();
  };

  const drawLines = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (selected.length < 2) return;
    const rect = boardRef.current.getBoundingClientRect();

    ctx.strokeStyle = 'yellow';
    ctx.lineWidth = 3;
    ctx.beginPath();

    selected.forEach((index, i) => {
      const cell = document.querySelector(`[data-index='${index}']`);
      if (!cell) return;
      const { left, top, width, height } = cell.getBoundingClientRect();
      const x = left - rect.left + width / 2;
      const y = top - rect.top + height / 2;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });

    ctx.stroke();
  };

  return (
    <div className="board-wrapper">
      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
        className="line-canvas"
      />
      <div
        ref={boardRef}
        onMouseLeave={handleMouseUp}
        className="apple-board"
      >
        {apples.map((val, index) => (
          <AppleCell
            key={index}
            index={index}
            value={val}
            isSelected={selected.includes(index)}
            onMouseDown={handleMouseDown}
            onMouseEnter={handleMouseEnter}
            onMouseUp={handleMouseUp}
          />
        ))}
      </div>
    </div>
  );
}
