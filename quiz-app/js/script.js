const quizData = [
  {
    question: "HTML의 약자는?",
    a: "Hyper Trainer Marking Language",
    b: "Hyper Text Markup Language",
    c: "Hyperlink Text Mark Language",
    d: "Home Tool Markup Language",
    correct: "b",
    explanation: "HTML은 Hyper Text Markup Language의 약자입니다."
  },
  {
    question: "CSS는 무엇을 의미할까요?",
    a: "Color Style Sheets",
    b: "Computer Style Sheets",
    c: "Cascading Style Sheets",
    d: "Creative Style Sheets",
    correct: "c",
    explanation: "CSS는 Cascading Style Sheets의 약자로, 스타일을 정의합니다."
  },
  {
    question: "JavaScript는 어떤 언어인가요?",
    a: "서버 개발 언어",
    b: "디자인 언어",
    c: "데이터베이스 언어",
    d: "웹 브라우저용 프로그래밍 언어",
    correct: "d",
    explanation: "JavaScript는 웹 페이지를 동적으로 만드는 프로그래밍 언어입니다."
  },
  {
    question: "CSS에서 글자색을 지정하는 속성은?",
    a: "text-color",
    b: "font-color",
    c: "color",
    d: "text-style",
    correct: "c",
    explanation: "`color` 속성은 텍스트 색상을 지정할 때 사용합니다."
  },
  {
    question: "HTML에서 링크를 생성하는 태그는?",
    a: "<img>",
    b: "<a>",
    c: "<link>",
    d: "<href>",
    correct: "b",
    explanation: "`<a>` 태그는 하이퍼링크를 생성할 때 사용합니다."
  },
  {
    question: "웹에서 이미지 삽입에 사용하는 태그는?",
    a: "<pic>",
    b: "<image>",
    c: "<src>",
    d: "<img>",
    correct: "d",
    explanation: "`<img>` 태그는 이미지를 삽입할 때 사용합니다."
  },
  {
    question: "자바스크립트에서 변수 선언 키워드가 아닌 것은?",
    a: "var",
    b: "let",
    c: "const",
    d: "define",
    correct: "d",
    explanation: "`define`은 JS에서 변수 선언에 사용되지 않습니다."
  },
  {
    question: "CSS에서 요소를 가로로 정렬하는 Flex 속성은?",
    a: "justify-content",
    b: "align-items",
    c: "text-align",
    d: "display-block",
    correct: "a",
    explanation: "`justify-content`는 주축 방향 정렬에 사용됩니다."
  },
  {
    question: "JavaScript에서 배열의 길이를 구하는 방법은?",
    a: "length()",
    b: "array.size",
    c: "array.length",
    d: "count(array)",
    correct: "c",
    explanation: "`array.length`는 배열의 길이를 반환합니다."
  },
  {
    question: "HTML에서 가장 큰 제목 태그는?",
    a: "<head>",
    b: "<h6>",
    c: "<title>",
    d: "<h1>",
    correct: "d",
    explanation: "`<h1>`은 가장 큰 제목 태그입니다."
  }
];

let currentQuiz = 0;
let score = 0;
let timer;
let timeLimit = 10;
let timeLeft = timeLimit;

const questionEl = document.getElementById('question');
const answerButtons = document.querySelectorAll('.answer-btn');
const nextBtn = document.getElementById('next-btn');
const resultEl = document.getElementById('result');
const explanationEl = document.getElementById('explanation');
const timeDisplay = document.getElementById('time-left');
const progressBar = document.getElementById('progress-bar');

function loadQuiz() {
  resetState();
  const current = quizData[currentQuiz];
  questionEl.innerText = current.question;
  answerButtons[0].innerText = "A. " + current.a;
  answerButtons[1].innerText = "B. " + current.b;
  answerButtons[2].innerText = "C. " + current.c;
  answerButtons[3].innerText = "D. " + current.d;

  // 타이머 초기화
  timeLeft = timeLimit;
  timeDisplay.textContent = timeLeft;
  timer = setInterval(() => {
    timeLeft--;
    timeDisplay.textContent = timeLeft;
    if (timeLeft === 0) {
      clearInterval(timer);
      autoSubmit();
    }
  }, 1000);

  updateProgressBar();
}

function resetState() {
  nextBtn.style.display = "none";
  resultEl.style.display = "none";
  explanationEl.style.display = "none";
  answerButtons.forEach(btn => {
    btn.disabled = false;
    btn.classList.remove("correct", "wrong");
  });
}

function handleAnswer(e) {
  clearInterval(timer);
  const selected = e.target.dataset.choice;
  const correct = quizData[currentQuiz].correct;
  const explanation = quizData[currentQuiz].explanation;

  answerButtons.forEach(btn => {
    btn.disabled = true;
    if (btn.dataset.choice === correct) {
      btn.classList.add("correct");
    } else if (btn.dataset.choice === selected) {
      btn.classList.add("wrong");
    }
  });

  if (selected === correct) score++;
  nextBtn.style.display = "inline-block";
  explanationEl.style.display = "block";
  explanationEl.textContent = `💬 해설: ${explanation}`;
}

function autoSubmit() {
  const correct = quizData[currentQuiz].correct;
  const explanation = quizData[currentQuiz].explanation;
  answerButtons.forEach(btn => {
    btn.disabled = true;
    if (btn.dataset.choice === correct) {
      btn.classList.add("correct");
    }
  });
  explanationEl.style.display = "block";
  explanationEl.textContent = `⏱ 시간 초과! 정답은 "${correct.toUpperCase()}"입니다. 💬 ${explanation}`;
  nextBtn.style.display = "inline-block";
}

answerButtons.forEach(btn => btn.addEventListener('click', handleAnswer));

nextBtn.addEventListener('click', () => {
  currentQuiz++;
  if (currentQuiz < quizData.length) {
    loadQuiz();
  } else {
    showResult();
  }
});

function updateProgressBar() {
  const percent = ((currentQuiz + 1) / quizData.length) * 100;
  progressBar.style.width = percent + "%";
}

function showResult() {
  questionEl.style.display = "none";
  document.querySelector('ul').style.display = "none";
  nextBtn.style.display = "none";
  document.getElementById('timer').style.display = "none";
  explanationEl.style.display = "none";
  document.querySelector('.progress-container').style.display = "none";
  resultEl.style.display = "block";
  resultEl.innerHTML = `<h2>🎉 당신의 점수: ${score} / ${quizData.length}</h2>`;
}

loadQuiz();
