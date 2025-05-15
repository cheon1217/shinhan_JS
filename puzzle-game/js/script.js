const board = document.getElementById('puzzle-board');
const message = document.getElementById('message');

const size = 4; // ✅ 4x4 퍼즐
let pieces = [];

// 퍼즐 조각 생성
function createPuzzle() {
  for (let i = 0; i < size * size; i++) {
    const piece = document.createElement('div');
    piece.classList.add('piece');
    piece.setAttribute('draggable', 'true');
    piece.dataset.index = i;

    const x = (i % size) * -100;
    const y = Math.floor(i / size) * -100;
    piece.style.backgroundPosition = `${x}px ${y}px`;

    pieces.push(piece);
  }
}

// 섞기
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// 렌더링
function renderBoard() {
  board.innerHTML = '';
  pieces.forEach(piece => board.appendChild(piece));
}

let draggedIdx = null;

board.addEventListener('dragstart', e => {
  if (e.target.classList.contains('piece')) {
    draggedIdx = Array.from(board.children).indexOf(e.target);
    e.target.classList.add('dragging');
  }
});

board.addEventListener('dragend', e => {
  if (e.target.classList.contains('piece')) {
    e.target.classList.remove('dragging');
  }
});

board.addEventListener('dragover', e => {
  e.preventDefault();
});

board.addEventListener('drop', e => {
  const dropTarget = e.target;
  if (!dropTarget.classList.contains('piece') || draggedIdx === null) return;

  const targetIdx = Array.from(board.children).indexOf(dropTarget);
  [pieces[draggedIdx], pieces[targetIdx]] = [pieces[targetIdx], pieces[draggedIdx]];
  renderBoard();
  draggedIdx = null;
  checkWin();
});

function checkWin() {
  const isCorrect = pieces.every((piece, idx) => +piece.dataset.index === idx);
  if (isCorrect) {
    message.textContent = "🎉 퍼즐 완성!";
  }
}

// 초기 실행
createPuzzle();
shuffle(pieces);
renderBoard();
