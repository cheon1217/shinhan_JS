document.addEventListener("DOMContentLoaded", () => {
  const modeSelector = document.getElementById("mode-selector");
  const calculator = document.getElementById("calculator");

  // 초기 모드 설정
  renderBasicCalculator();

  // 모드 변경 이벤트
  modeSelector.addEventListener("change", (e) => {
    const mode = e.target.value;
    if (mode === "basic") {
      renderBasicCalculator();
    } else if (mode === "scientific") {
      renderScientificCalculator();
    } else if (mode === "engineering") {
      renderEngineeringCalculator();
    } else if (mode === "programmer") {
      renderProgrammerCalculator();
    }
  });

  // 기초 계산기 렌더링
  function renderBasicCalculator() {
    calculator.innerHTML = `
      <input type="text" id="display" disabled>
      <button onclick="appendValue('7')">7</button>
      <button onclick="appendValue('8')">8</button>
      <button onclick="appendValue('9')">9</button>
      <button onclick="setOperator('/')">÷</button>
      <button onclick="appendValue('4')">4</button>
      <button onclick="appendValue('5')">5</button>
      <button onclick="appendValue('6')">6</button>
      <button onclick="setOperator('*')">×</button>
      <button onclick="appendValue('1')">1</button>
      <button onclick="appendValue('2')">2</button>
      <button onclick="appendValue('3')">3</button>
      <button onclick="setOperator('-')">−</button>
      <button onclick="appendValue('0')">0</button>
      <button onclick="appendValue('.')">.</button>
      <button onclick="calculate()">=</button>
      <button onclick="setOperator('+')">+</button>
      <button onclick="clearDisplay()">C</button>
    `;
  }

  // 과학용 계산기 렌더링
  function renderScientificCalculator() {
    calculator.innerHTML = `
      <input type="text" id="display" disabled>
      <button onclick="appendValue('sin(')">sin</button>
      <button onclick="appendValue('cos(')">cos</button>
      <button onclick="appendValue('tan(')">tan</button>
      <button onclick="appendValue('log(')">log</button>
      <button onclick="appendValue('sqrt(')">√</button>
      <button onclick="appendValue('(')">(</button>
      <button onclick="appendValue(')')">)</button>
      <button onclick="appendValue('^')">^</button>
      <button onclick="appendValue('pi')">π</button>
      <button onclick="appendValue('e')">e</button>
      <button onclick="clearDisplay()">C</button>
      <button onclick="calculate()">=</button>
    `;
  }

  // 공학용 계산기 렌더링
  function renderEngineeringCalculator() {
    calculator.innerHTML = `
      <input type="text" id="display" disabled>
      <button onclick="appendValue('AND')">AND</button>
      <button onclick="appendValue('OR')">OR</button>
      <button onclick="appendValue('NOT')">NOT</button>
      <button onclick="appendValue('XOR')">XOR</button>
      <button onclick="clearDisplay()">C</button>
      <button onclick="calculate()">=</button>
    `;
  }

  // 프로그래머 계산기 렌더링
  function renderProgrammerCalculator() {
    calculator.innerHTML = `
      <input type="text" id="display" disabled>
      <button onclick="appendValue('0')">0</button>
      <button onclick="appendValue('1')">1</button>
      <button onclick="appendValue('AND')">AND</button>
      <button onclick="appendValue('OR')">OR</button>
      <button onclick="appendValue('NOT')">NOT</button>
      <button onclick="appendValue('XOR')">XOR</button>
      <button onclick="clearDisplay()">C</button>
      <button onclick="calculate()">=</button>
    `;
  }
});

// 계산 로직
let currentValue = "";
let operator = "";

function appendValue(value) {
  const display = document.getElementById("display");
  currentValue += value;
  display.value = currentValue;
}

function setOperator(op) {
  const display = document.getElementById("display");
  operator = op;
  currentValue += ` ${op} `;
  display.value = currentValue;
}

function calculate() {
  const display = document.getElementById("display");
  try {
    display.value = eval(currentValue.replace("÷", "/").replace("×", "*"));
    currentValue = display.value;
  } catch (error) {
    display.value = "Error";
    currentValue = "";
  }
}

function clearDisplay() {
  const display = document.getElementById("display");
  display.value = "";
  currentValue = "";
  operator = "";
}