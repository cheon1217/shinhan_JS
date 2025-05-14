const socket = new WebSocket(`ws://${window.location.host}`);

let username = null;

// DOM elements
const authContainer = document.getElementById('auth-container');
const chatContainer = document.getElementById('chat-container');
const usernameInput = document.getElementById('username');
const loginButton = document.getElementById('login');
const welcomeMessage = document.getElementById('welcome-message');
const chatBox = document.getElementById('chat-box');
const messageInput = document.getElementById('message');
const sendButton = document.getElementById('send');
const userListContainer = document.getElementById('user-list'); // 사용자 목록 DOM
const fileInput = document.getElementById('file-input');

// 이미지 모달 관련 DOM
const imageModal = document.getElementById('image-modal');
const modalImage = document.getElementById('modal-image');
const closeModal = document.getElementById('close-modal');

// 로그인 처리 함수
function handleLogin() {
  const enteredUsername = usernameInput.value.trim();
  if (enteredUsername) {
    username = enteredUsername;
    authContainer.classList.add('hidden');
    chatContainer.classList.remove('hidden');
    welcomeMessage.textContent = `환영합니다, ${username}!`;

    // 3초 후 환영 메시지 숨기기
    setTimeout(() => {
      welcomeMessage.classList.add('hidden');
    }, 3000);

    socket.send(JSON.stringify({ type: 'login', username }));
  }
}

// 로그인 버튼 클릭 이벤트
loginButton.addEventListener('click', handleLogin);

// Enter 키로 로그인
usernameInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    handleLogin();
  }
});

// 메시지 전송
function sendMessage() {
  const text = messageInput.value.trim();
  if (text) {
    const messageId = Date.now(); // 고유 ID
    addMessage(username, text, 'sent', messageId);
    socket.send(JSON.stringify({
      type: 'message',
      username,
      text,
      messageId,
    }));
    messageInput.value = '';
  }
}

// 전송 버튼 클릭 이벤트
sendButton.addEventListener('click', sendMessage);

// Enter 키로 메시지 전송
messageInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    sendMessage();
  }
});

// 파일 전송 함수
function sendFile(file) {
  const reader = new FileReader();
  reader.onload = () => {
    const fileData = reader.result;
    const fileName = file.name;

    // 서버로 파일 전송
    socket.send(JSON.stringify({
      type: 'file',
      username,
      fileName,
      fileData,
    }));

    // 클라이언트에 파일 표시
    addFile(username, fileName, fileData, 'sent');
  };
  reader.readAsDataURL(file); // 파일을 Base64로 인코딩
}

// 파일 선택 이벤트
fileInput.addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (file) {
    sendFile(file);
    fileInput.value = ''; // 파일 입력 초기화
  }
});

// 메시지 렌더링 함수 수정
function addMessage(user, text, type, messageId = null) {
  const messageElement = document.createElement('div');
  messageElement.classList.add('message', type);
  if (messageId) messageElement.dataset.messageId = messageId;

  const usernameElement = document.createElement('div');
  usernameElement.classList.add('username');
  usernameElement.textContent = user;

  const textElement = document.createElement('div');
  textElement.classList.add('text');
  textElement.textContent = text;

  const timestampElement = document.createElement('div');
  timestampElement.classList.add('timestamp');
  const now = new Date();
  timestampElement.textContent = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

  const statusElement = document.createElement('div');
  statusElement.classList.add('status');

  // ✅ '보낸 메시지'에만 전송 상태 표시
  if (type === 'sent') {
    statusElement.textContent = '전송됨';
  }

  messageElement.append(usernameElement, textElement, timestampElement, statusElement);
  chatBox.appendChild(messageElement);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// 파일 추가 함수 수정
function addFile(user, fileName, fileData, type) {
  const messageElement = document.createElement('div');
  messageElement.classList.add('message', type);

  const usernameElement = document.createElement('div');
  usernameElement.classList.add('username');
  usernameElement.textContent = user;

  const fileElement = document.createElement('div');
  fileElement.classList.add('file');

  if (fileData.startsWith('data:image')) {
    // 이미지 파일
    const img = document.createElement('img');
    img.src = fileData;
    img.alt = fileName;
    img.style.maxWidth = '200px';
    img.style.borderRadius = '5px';
    img.style.cursor = 'pointer';

    // 이미지 클릭 이벤트 (모달 열기)
    img.addEventListener('click', () => {
      modalImage.src = fileData;
      imageModal.classList.remove('hidden');
    });

    fileElement.appendChild(img);
  } else {
    // 일반 파일
    const link = document.createElement('a');
    link.href = fileData;
    link.download = fileName;
    link.textContent = `📄 ${fileName}`;
    fileElement.appendChild(link);
  }

  messageElement.appendChild(usernameElement);
  messageElement.appendChild(fileElement);
  chatBox.appendChild(messageElement);
  chatBox.scrollTop = chatBox.scrollHeight; // Scroll to the bottom
}

// 모달 닫기 이벤트
closeModal.addEventListener('click', () => {
  imageModal.classList.add('hidden');
});

// 모달 외부 클릭 시 닫기
imageModal.addEventListener('click', (event) => {
  if (event.target === imageModal) {
    imageModal.classList.add('hidden');
  }
});

// 소켓 메시지 수신 처리
socket.addEventListener('message', (event) => {
  const data = JSON.parse(event.data);

  if (data.type === 'message' && data.username !== username) {
    addMessage(data.username, data.text, 'received', data.messageId);

    // 읽음 알림 전송
    socket.send(JSON.stringify({
      type: 'read',
      messageId: data.messageId,
      toUsername: data.username, // 메시지 보낸 사람 이름
    }));
  }

  if (data.type === 'read') {
    const messageEl = document.querySelector(`[data-message-id="${data.messageId}"]`);
    if (messageEl && messageEl.classList.contains('sent')) {
      const statusEl = messageEl.querySelector('.status');
      if (statusEl) {
        statusEl.textContent = `${data.reader}님이 읽음`; // ✅ 상태 변경
      }
    }
  }

  else if (data.type === 'file' && data.username !== username) {
    addFile(data.username, data.fileName, data.fileData, 'received');
  }

  else if (data.type === 'userList') {
    updateUserList(data.users);
  }
});

// 사용자 목록 업데이트 함수
function updateUserList(users) {
  userListContainer.innerHTML = ''; // 기존 목록 초기화
  users.forEach((user) => {
    const userElement = document.createElement('div');
    userElement.textContent = user;
    userElement.classList.add('user');
    userListContainer.appendChild(userElement);
  });
}
