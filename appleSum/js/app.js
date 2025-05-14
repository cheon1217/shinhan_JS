const board = document.getElementById("game-board");
const message = document.getElementById("message");
const scoreDisplay = document.getElementById("score");
const timerDisplay = document.getElementById("timer");
const restartBtn = document.getElementById("restart-btn");

let selected = [];
let score = 0;
let timer;
let timeLeft = 60;
let isDragging = false;
let startPoint = null;

function generateNumbers() {
  const nums = [];
  for (let i = 0; i < 100; i++) {
    nums.push(Math.floor(Math.random() * 9) + 1);
  }
  return nums;
}

function renderBoard() {
  board.innerHTML = "";
  selected = [];
  const numbers = generateNumbers();

  numbers.forEach((num, index) => {
    const apple = document.createElement("div");
    apple.classList.add("apple");
    apple.dataset.index = index;
    apple.dataset.value = num;
    apple.textContent = num;

    apple.addEventListener("mousedown", () => {
      isDragging = true;
      selected = [apple];
      apple.classList.add("selected");
    });

    apple.addEventListener("mouseenter", () => {
      if (isDragging && !selected.includes(apple)) {
        selected.push(apple);
        apple.classList.add("selected");
      }
    });

    board.appendChild(apple);
  });

  document.addEventListener("mouseup", handleMouseUp);
}

function handleMouseUp() {
  if (!isDragging) return;
  isDragging = false;

  const sum = selected.reduce((acc, el) => acc + Number(el.dataset.value), 0);

  if (sum === 10) {
    score += 10;
    scoreDisplay.textContent = score;
    selected.forEach(el => el.remove());
    message.textContent = "💥 성공!";
  } else {
    message.textContent = "❌ 합이 10이 아니에요!";
    setTimeout(() => {
      selected.forEach(el => el.classList.remove("selected"));
      message.textContent = "";
    }, 600);
  }

  selected = [];
}

function startTimer() {
  clearInterval(timer);
  timeLeft = 100;
  timerDisplay.textContent = timeLeft;
  timer = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timer);
      message.textContent = "⏰ 시간이 끝났어요! 점수: " + score;
      document.querySelectorAll(".apple").forEach(el => {
        const newEl = el.cloneNode(true);
        el.replaceWith(newEl); // 클릭 제거용
      });
    }
  }, 1000);
}

restartBtn.addEventListener("click", () => {
  score = 0;
  scoreDisplay.textContent = score;
  message.textContent = "";
  renderBoard();
  startTimer();
});

renderBoard();
startTimer();
