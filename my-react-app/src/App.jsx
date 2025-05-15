import { useEffect, useState } from 'react';
import AppleBoard from './components/AppleBoard';
import useGameTimer from './hooks/useGameTimer';
import { generateApples, sumSelected } from './utils/helpers';
import './App.css';

const GAME_TIME = 100;

export default function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [apples, setApples] = useState(generateApples());
  const [selected, setSelected] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [targetSum, setTargetSum] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [highScores, setHighScores] = useState([]);
  const [timeLeft, resetTimer, startTimer] = useGameTimer(GAME_TIME, () => {
    setIsDragging(false);
    setSelected([]);
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState('desc');

  const isGameOver = isStarted && timeLeft <= 0;

  useEffect(() => {
    if (isGameOver) {
      saveScore();
      fetchHighScores();
    }
  }, [isGameOver]);

  const handleRegister = async () => {
    try {
      const response = await fetch('http://192.168.0.87:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.error);
        return;
      }

      alert('회원가입이 완료되었습니다. 이제 로그인하세요.');
    } catch (error) {
      console.error('회원가입 실패:', error);
    }
  };

  const handleLogin = async () => {
    try {
      const response = await fetch('http://192.168.0.87:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.error);
        return;
      }

      const data = await response.json();
      setIsLoggedIn(true);
      setHighScores(data.scores); // 로그인 시 해당 사용자의 점수를 저장
    } catch (error) {
      console.error('로그인 실패:', error);
    }
  };

  const handleStartGame = (value) => {
    setTargetSum(value);
    resetTimer();
    setIsStarted(true);
    startTimer();
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const sum = sumSelected(apples, selected);
    if (sum === targetSum) {
      const nextCombo = combo + 1;
      setCombo(nextCombo);
      const gained = 10 + nextCombo * 5;
      setScore((prev) => prev + gained);
      setApples((prev) =>
        prev.map((val, idx) => (selected.includes(idx) ? null : val))
      );
    } else {
      setCombo(0);
    }

    setSelected([]);
  };

  const restartGame = () => {
    setApples(generateApples());
    setSelected([]);
    setScore(0);
    setCombo(0);
    setIsStarted(false);
    setTargetSum(0);
    resetTimer();
  };

  const saveScore = async () => {
    try {
      await fetch('http://192.168.0.87:5000/api/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, score }),
      });
    } catch (error) {
      console.error('점수 저장 실패:', error);
    }
  };

  const fetchHighScores = async (sort = 'desc', page = 1, limit = 5) => {
    try {
      const response = await fetch(
        `http://192.168.0.87:5000/api/scores?sort=${sort}&page=${page}&limit=${limit}`
      );
      const data = await response.json();
      setHighScores(data); // 점수 데이터 업데이트
      setCurrentPage(page); // 현재 페이지 업데이트
      setSortOrder(sort); // 정렬 순서 업데이트
    } catch (error) {
      console.error('점수 가져오기 실패:', error);
    }
  };

  return (
    <div className="container">
      {!isLoggedIn ? (
        <div className="login">
          <h1>🍎 숫자 사과 게임</h1>
          <input
            type="text"
            placeholder="아이디"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="nickname-input"
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="nickname-input"
          />
          <button onClick={handleRegister} className="login-button">
            회원가입
          </button>
          <button onClick={handleLogin} className="login-button">
            로그인
          </button>
        </div>
      ) : (
        <>
          <h1>🍎 숫자 사과 게임</h1>
          <div className="difficulty-select">
            🎯 목표 합:
            <select
              value={targetSum}
              onChange={(e) => handleStartGame(Number(e.target.value))}
              disabled={isStarted}
            >
              <option value={0} disabled>
                선택하세요
              </option>
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={20}>20</option>
            </select>
          </div>

          {!isStarted && (
            <div className="start-message">목표 합을 선택하면 게임이 시작됩니다!</div>
          )}

          {isStarted && !isGameOver && (
            <div className="status">
              점수: {score} / 남은 시간: {timeLeft}초
            </div>
          )}

          {isStarted && (
            <AppleBoard
              apples={apples}
              selected={selected}
              setSelected={setSelected}
              isDragging={isDragging}
              setIsDragging={setIsDragging}
              disabled={isGameOver}
              onMouseUp={handleMouseUp}
            />
          )}

          {isStarted && isGameOver && (
            <div className="final-score">
              ⏰ 게임 종료!<br />
              최종 점수: {score}
            </div>
          )}

          {!isStarted && (
            <div className="high-scores">
              <h2>🏆 상위 점수</h2>
              <div className="sort-options">
                <button onClick={() => { setSortOrder('desc'); fetchHighScores('desc'); }}>
                  높은 점수 순
                </button>
                <button onClick={() => { setSortOrder('asc'); fetchHighScores('asc'); }}>
                  낮은 점수 순
                </button>
              </div>
              <ul>
                {highScores.map((user, index) => (
                  <li key={index}>
                    {(currentPage - 1) * 5 + index + 1}. {user.username}: {user.score}점
                  </li>
                ))}
              </ul>
              <div className="pagination">
                {sortOrder === 'desc' ? (
                  <>
                    <button
                      onClick={() => fetchHighScores('desc', currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      이전
                    </button>
                    <button
                      onClick={() => fetchHighScores('desc', currentPage + 1)}
                    >
                      다음
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => fetchHighScores('asc', currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      이전
                    </button>
                    <button
                      onClick={() => fetchHighScores('asc', currentPage + 1)}
                    >
                      다음
                    </button>
                  </>
                )}
              </div>
            </div>
          )}

          {isLoggedIn && (
            <div className="user-scores">
              <h2>점수표</h2>
              <ul>
                {highScores.length > 0 ? (
                  highScores.map((score, index) => (
                    <li key={index}>
                      게임 {index + 1}: {score.username} - {score.score}점
                    </li>
                  ))
                ) : (
                  <li>점수가 없습니다.</li>
                )}
              </ul>
            </div>
          )}

          {isStarted && (
            <button onClick={restartGame} className="restart-button">
              다시 시작
            </button>
          )}
        </>
      )}
    </div>
  );
}
