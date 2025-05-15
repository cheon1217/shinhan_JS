document.addEventListener("DOMContentLoaded", () => {
  const todoText = document.getElementById("todo-text");
  const addButton = document.getElementById("add-button");
  const todoList = document.getElementById("todo-list");

  // 할 일 추가
  addButton.addEventListener("click", () => {
    const text = todoText.value.trim();
    if (text === "") {
      alert("할 일을 입력하세요.");
      return;
    }

    addTodoItem(text);
    todoText.value = ""; // 입력 필드 초기화
    updateOrder(); // 순서 업데이트
  });

  // 할 일 추가 함수
  function addTodoItem(text) {
    const listItem = document.createElement("li");
    listItem.classList.add("todo-item");

    const orderSpan = document.createElement("span");
    orderSpan.classList.add("order");
    orderSpan.textContent = ""; // 순서는 이후 업데이트

    const textSpan = document.createElement("span");
    textSpan.textContent = text;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "삭제";
    deleteButton.classList.add("delete-button");
    deleteButton.addEventListener("click", () => {
      todoList.removeChild(listItem);
      updateOrder(); // 순서 업데이트
    });

    // 클릭 시 완료 표시 (밑줄 처리)
    listItem.addEventListener("click", () => {
      listItem.classList.toggle("completed");
    });

    listItem.appendChild(orderSpan);
    listItem.appendChild(textSpan);
    listItem.appendChild(deleteButton);
    todoList.appendChild(listItem);
  }

  // 순서 업데이트 함수
  function updateOrder() {
    const items = document.querySelectorAll(".todo-item .order");
    items.forEach((orderSpan, index) => {
      orderSpan.textContent = `${index + 1}.`; // 순서를 1부터 시작
    });
  }
});