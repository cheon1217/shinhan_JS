document.addEventListener("DOMContentLoaded", () => {
  const board = document.getElementById("board");
  const turnInfo = document.getElementById("turn-info");
  const statusInfo = document.getElementById("status-info");
  const resetButton = document.getElementById("reset-button");

  const BOARD_SIZE = 15;
  let currentTurn = "black"; // 흑돌 시작
  let boardState = Array.from({ length: BOARD_SIZE }, () =>
    Array(BOARD_SIZE).fill(null)
  );

  // 보드 초기화
  function initializeBoard() {
    board.innerHTML = "";
    boardState = Array.from({ length: BOARD_SIZE }, () =>
      Array(BOARD_SIZE).fill(null)
    );
    currentTurn = "black";
    turnInfo.textContent = "현재 턴: ";
    statusInfo.textContent = "";

    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.dataset.row = row;
        cell.dataset.col = col;
        cell.addEventListener("click", handleCellClick);
        board.appendChild(cell);
      }
    }
  }

  // 셀 클릭 이벤트
  function handleCellClick(e) {
    const cell = e.target;
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);

    if (boardState[row][col] !== null || statusInfo.textContent !== "") {
      return; // 이미 놓인 자리거나 게임 종료 시 클릭 무시
    }

    // 금수 규칙 적용 (흑돌만 금수 적용)
    if (currentTurn === "black" && isForbidden(row, col)) {
      statusInfo.textContent = "금수입니다! 다른 곳에 놓으세요.";
      return;
    }

    // 돌 놓기
    boardState[row][col] = currentTurn;
    cell.classList.add(currentTurn);

    // 승리 조건 확인
    if (checkWin(row, col)) {
      statusInfo.textContent = `${currentTurn === "black" ? "흑" : "백"} 승리!`;
      return;
    }

    // 턴 변경
    currentTurn = currentTurn === "black" ? "white" : "black";
    turnInfo.textContent = `현재 턴: ${currentTurn === "black" ? "흑" : "백"}`;
  }

  // 금수 규칙 확인
  function isForbidden(row, col) {
    // 33, 44 금수 규칙 확인
    const threeCount = countPatterns(row, col, 3);
    const fourCount = countPatterns(row, col, 4);

    return threeCount >= 2 || fourCount >= 2;
  }

  // 특정 패턴 개수 확인
  function countPatterns(row, col, length) {
    let count = 0;
    const directions = [
      [0, 1],
      [1, 0],
      [1, 1],
      [1, -1],
    ];

    for (const [dx, dy] of directions) {
      let line = "";
      for (let i = -length; i <= length; i++) {
        const x = row + i * dx;
        const y = col + i * dy;
        if (x >= 0 && x < BOARD_SIZE && y >= 0 && y < BOARD_SIZE) {
          line += boardState[x][y] === "black" ? "B" : ".";
        } else {
          line += ".";
        }
      }
      if (line.split("B").length - 1 === length) {
        count++;
      }
    }

    return count;
  }

  // 승리 조건 확인
  function checkWin(row, col) {
    const directions = [
      [0, 1],
      [1, 0],
      [1, 1],
      [1, -1],
    ];

    for (const [dx, dy] of directions) {
      let count = 1;

      for (let i = 1; i < 5; i++) {
        const x = row + i * dx;
        const y = col + i * dy;
        if (
          x >= 0 &&
          x < BOARD_SIZE &&
          y >= 0 &&
          y < BOARD_SIZE &&
          boardState[x][y] === currentTurn
        ) {
          count++;
        } else {
          break;
        }
      }

      for (let i = 1; i < 5; i++) {
        const x = row - i * dx;
        const y = col - i * dy;
        if (
          x >= 0 &&
          x < BOARD_SIZE &&
          y >= 0 &&
          y < BOARD_SIZE &&
          boardState[x][y] === currentTurn
        ) {
          count++;
        } else {
          break;
        }
      }

      if (count >= 5) {
        return true;
      }
    }

    return false;
  }

  // 게임 초기화 버튼
  resetButton.addEventListener("click", initializeBoard);

  // 초기화
  initializeBoard();
});