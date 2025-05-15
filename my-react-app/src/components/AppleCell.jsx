// components/AppleCell.jsx
import React from 'react';
import './AppleCell.css';

export default function AppleCell({
  index,
  value,
  isSelected,
  onMouseDown,
  onMouseEnter,
  onMouseUp
}) {
  const classNames = [
    'apple-cell',
    value === null ? 'hidden' : '',
    isSelected ? 'selected' : '',
  ].join(' ').trim();

  return (
    <div
      data-index={index}
      onMouseDown={() => onMouseDown(index)}
      onMouseEnter={() => onMouseEnter(index)}
      onMouseUp={onMouseUp}
      className={classNames}
    >
      {value !== null ? value : ''}
    </div>
  );
}
