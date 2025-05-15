// 게임 상태 변수
let score = 0;
let level = 1;
let health = 100;
let isGameOver = false;
let gameStarted = false;
let gamePaused = false;
let playerPosition = 270;
let playerWidth = 60;
let bullets = [];
let enemyBullets = [];
let enemies = [];
let explosions = [];
let powerUps = [];
let stars = [];
let notifications = [];
let lastEnemySpawn = 0;
let lastEnemyShot = 0;
let lastPowerUpSpawn = 0;
let enemySpawnRate = 1500; // ms
let enemyShootRate = 2000; // ms
let powerUpSpawnRate = 10000; // ms
let bossActive = false;
let bossHealth = 1000;
let bossMaxHealth = 1000;
let weaponLevel = 1;
let specialWeaponAmmo = 3;
let hasShield = false;
let shieldTime = 0;
let specialWeaponCooldown = 0;
let soundEnabled = false;
let hitAnimationActive = false;
let playerVerticalPosition = 510; // 초기 세로 위치 (600px - 60px - 30px)
let playerHeight = 60; // 플레이어 높이
let shieldCount = 0;
let levelTimer = 0; // 경과 시간(ms)
let lastTimestamp = 0;
let levelUpInterval = 12000; // 12초
let levelTimerPaused = false;

// 요소 가져오기
const player = document.getElementById('player');
const playerShip = document.getElementById('playerShip');
const gameContainer = document.getElementById('gameContainer');
const scoreElement = document.getElementById('score');
const levelElement = document.getElementById('level');
const healthElement = document.getElementById('health');
const healthFill = document.querySelector('.healthFill');
const powerUpDisplay = document.getElementById('powerUpDisplay');
const bossHealthDisplay = document.getElementById('bossHealth');
const bossHealthFill = document.querySelector('.bossHealthFill');
const gameOverElement = document.getElementById('gameOver');
const finalScoreElement = document.getElementById('finalScore');
const restartBtn = document.getElementById('restartBtn');
const levelUpElement = document.getElementById('levelUp');
const newLevelElement = document.getElementById('newLevel');
const continueBtn = document.getElementById('continueBtn');
const bossWarningElement = document.getElementById('bossWarning');
const startScreen = document.getElementById('startScreen');
const startBtn = document.getElementById('startBtn');
const soundButton = document.getElementById('soundButton');

// 오디오 요소 생성
const shootSound = new Audio('data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAA==');
const explosionSound = new Audio('data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAA==');
const powerUpSound = new Audio('data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAA==');
const hurtSound = new Audio('data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAA==');
const levelUpSound = new Audio('data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAA==');
const bossSound = new Audio('data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAA==');
const specialWeaponSound = new Audio('data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAA==');

// 오디오 설정
// 배경음악 오디오 요소 생성
const bgm = new Audio('data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAA==');
bgm.loop = true;

// 소리 켜기/끄기 버튼
soundButton.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    if (soundEnabled) {
        soundButton.textContent = '소리 끄기';
        if (gameStarted && !isGameOver && !gamePaused) {
            bgm.play().catch(e => console.log("오디오 재생 실패:", e));
        }
    } else {
        soundButton.textContent = '소리 켜기';
        bgm.pause();
    }
});

// 키 상태
let keys = {
    left: false,
    right: false,
    space: false,
    z: false
};

// 키 이벤트 리스너
document.addEventListener('keydown', (e) => {
    if (!gameStarted || isGameOver || gamePaused) return;

    if (e.key === 'ArrowLeft') keys.left = true;
    if (e.key === 'ArrowRight') keys.right = true;
    if (e.key === 'ArrowUp') keys.up = true;
    if (e.key === 'ArrowDown') keys.down = true;
    if (e.key === ' ' && !keys.space) {
        keys.space = true;
        fireBullet();
    }
    // 특수 무기: Z키
    if ((e.key === 'z' || e.key === 'Z') && !keys.z) {
        keys.z = true;
        fireSpecialWeapon();
    }
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft') keys.left = false;
    if (e.key === 'ArrowRight') keys.right = false;
    if (e.key === 'ArrowUp') keys.up = false;
    if (e.key === 'ArrowDown') keys.down = false;
    if (e.key === ' ') keys.space = false;
    if (e.key === 'z' || e.key === 'Z') keys.z = false;
});

// 게임 시작 버튼 클릭 시
startBtn.addEventListener('click', () => {
    startScreen.style.display = 'none';
    gameStarted = true;

    // 플레이어 위치 초기화
    playerPosition = 270;
    playerVerticalPosition = 510;
    player.style.left = playerPosition + 'px';
    player.style.top = playerVerticalPosition + 'px';

    if (soundEnabled) {
        bgm.play().catch(e => console.log("오디오 재생 실패:", e));
    }

    createStars();
    updatePowerUpDisplay();
    gameLoop();
});

// 재시작 버튼
restartBtn.addEventListener('click', () => {
    resetGame();
});

// 계속하기 버튼
continueBtn.addEventListener('click', () => {
    levelUpElement.style.display = 'none';
    gamePaused = false;
    gameLoop();
});

// 별 생성 함수
function createStars() {
    for (let i = 0; i < 50; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        const size = Math.random() * 2 + 1;
        star.style.width = size + 'px';
        star.style.height = size + 'px';
        star.style.left = Math.random() * 600 + 'px';
        star.style.top = Math.random() * 600 + 'px';
        star.style.opacity = Math.random() * 0.7 + 0.3;
        gameContainer.appendChild(star);
        stars.push(star);
    }
}

// 별 이동 함수
function updateStars() {
    for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        const currentTop = parseFloat(star.style.top);
        const speed = parseFloat(star.style.width) / 2; // 크기에 따른 속도
        
        star.style.top = (currentTop + speed) + 'px';
        
        // 화면 밖으로 나간 별 재배치
        if (currentTop > 600) {
            star.style.top = '0px';
            star.style.left = Math.random() * 600 + 'px';
        }
    }
}

// 적 이동 함수
function updateEnemies() {
    for (let i = enemies.length - 1; i >= 0; i--) {
        const enemyObj = enemies[i];
        const enemy = enemyObj.element;
        const currentTop = parseFloat(enemy.style.top);

        // 보스는 움직이지 않음
        if (enemyObj.type === 'boss') continue;

        // 적이 아래로 이동
        enemy.style.top = (currentTop + 2) + 'px';

        // 화면 밖으로 나간 적 제거
        if (currentTop > 600) {
            if (gameContainer.contains(enemy)) {
                gameContainer.removeChild(enemy);
            }
            enemies.splice(i, 1);
        }
    }
}

// 총알 이동 함수
function updateBullets() {
    for (let i = bullets.length - 1; i >= 0; i--) {
        const bullet = bullets[i].element;
        const currentTop = parseFloat(bullet.style.top);
        bullet.style.top = (currentTop - 5) + 'px';

        if (currentTop < 0) {
            if (gameContainer.contains(bullet)) {
                gameContainer.removeChild(bullet);
            }
            bullets.splice(i, 1);
        }
    }
}

// 총알 발사
function fireBullet() {
    if (soundEnabled) {
        shootSound.currentTime = 0;
        shootSound.play().catch(e => console.log("오디오 재생 실패:", e));
    }

    const bulletY = playerVerticalPosition; // 플레이어 Y 좌표에서 총알 시작

    switch(weaponLevel) {
        case 1:
            createBullet(playerPosition + playerWidth / 2 - 3, bulletY, 'bullet');
            break;
        case 2:
            createBullet(playerPosition + playerWidth / 3 - 3, bulletY, 'bullet');
            createBullet(playerPosition + playerWidth * 2 / 3 - 3, bulletY, 'bullet');
            break;
        case 3:
            createBullet(playerPosition + playerWidth / 2 - 3, bulletY, 'bullet');
            createBullet(playerPosition + playerWidth / 4 - 3, bulletY, 'bullet');
            createBullet(playerPosition + playerWidth * 3 / 4 - 3, bulletY, 'bullet');
            break;
        case 4:
            createBullet(playerPosition + playerWidth / 5 - 3, bulletY, 'bullet');
            createBullet(playerPosition + playerWidth * 2 / 5 - 3, bulletY, 'bullet');
            createBullet(playerPosition + playerWidth * 3 / 5 - 3, bulletY, 'bullet');
            createBullet(playerPosition + playerWidth * 4 / 5 - 3, bulletY, 'bullet');
            break;
        case 5:
            createBullet(playerPosition + playerWidth / 2 - 3, bulletY, 'bullet');
            createBullet(playerPosition + playerWidth / 3 - 3, bulletY, 'bullet');
            createBullet(playerPosition + playerWidth * 2 / 3 - 3, bulletY, 'bullet');
            createBullet(playerPosition + playerWidth / 6 - 3, bulletY, 'bullet');
            createBullet(playerPosition + playerWidth * 5 / 6 - 3, bulletY, 'bullet');
            break;
    }
}

// 총알 생성 함수
function createBullet(xPos, yPos, type) {
    const bullet = document.createElement('div');
    bullet.className = type;
    bullet.style.left = xPos + 'px';
    bullet.style.top = yPos + 'px'; // top 사용
    gameContainer.appendChild(bullet);
    bullets.push({element: bullet, type: type});
}

// 특수 무기 발사
function fireSpecialWeapon() {
    if (specialWeaponAmmo <= 0 || specialWeaponCooldown > 0) return;
    
    if (soundEnabled) {
        specialWeaponSound.currentTime = 0;
        specialWeaponSound.play().catch(e => console.log("오디오 재생 실패:", e));
    }
    
    specialWeaponAmmo--;
    specialWeaponCooldown = 3000; // 3초 쿨다운
    updatePowerUpDisplay();
    
    // 초강력 빔
    const powerShot = document.createElement('div');
    powerShot.className = 'powerShot';
    powerShot.style.left = (playerPosition + playerWidth/2 - 7) + 'px';
    powerShot.style.bottom = '70px';
    gameContainer.appendChild(powerShot);
    bullets.push({element: powerShot, type: 'powerShot'});
    
    // 화면 번쩍임 효과
    gameContainer.style.boxShadow = '0 0 40px #44f, 0 0 80px #22f';
    setTimeout(() => {
        gameContainer.style.boxShadow = '0 0 20px #00f, 0 0 40px #00f';
    }, 200);
    
    // 알림 표시
    showNotification('특수 무기 발사!', playerPosition + playerWidth/2, 'bottom', '#44f');
}

// 적 생성
function spawnEnemy() {
    const enemy = document.createElement('div');
    
    // 레벨에 따른 적 종류 결정
    let enemyType;
    let randomValue = Math.random();
    
    if (level <= 3) {
        enemyType = randomValue < 0.7 ? 'enemy1' : 'enemy2';
    } else {
        if (randomValue < 0.4) enemyType = 'enemy1';
        else if (randomValue < 0.8) enemyType = 'enemy2';
        else enemyType = 'enemy3';
    }
    
    enemy.className = 'enemy ' + enemyType;
    
    // 적 위치 설정
    const xPos = Math.random() * (600 - 40);
    enemy.style.left = xPos + 'px';
    enemy.style.top = '0px';
    
    // 적 체력 설정 (레벨에 따라 증가)
    const enemyHealth = enemyType === 'enemy3' ? 3 + Math.floor(level/2) : 1 + Math.floor(level/3);
    
    gameContainer.appendChild(enemy);
    enemies.push({
        element: enemy,
        type: enemyType,
        health: enemyHealth
    });
}

// 보스 생성
function spawnBoss() {
    bossActive = true;
    // 3, 6, 9... 레벨에서 체력 100, 200, 300...
    const bossLevel = Math.floor(level / 3);
    bossHealth = 100 * bossLevel;
    bossMaxHealth = bossHealth;

    bossWarningElement.style.display = 'block';

    if (soundEnabled) {
        bossSound.play().catch(e => console.log("오디오 재생 실패:", e));
    }

    setTimeout(() => {
        bossWarningElement.style.display = 'none';

        const boss = document.createElement('div');
        boss.className = 'enemy boss';
        boss.style.left = '250px';
        boss.style.top = '50px';
        boss.style.pointerEvents = 'none';
        boss.style.transition = 'opacity 0.7s, transform 0.7s';

        gameContainer.appendChild(boss);

        enemies.push({
            element: boss,
            type: 'boss',
            health: bossHealth
        });

        bossHealthDisplay.style.display = 'block';
        bossHealthFill.style.width = '100%';
    }, 2000);
}

// 보스 죽음 애니메이션 (CSS 추가 필요)
function killBoss(bossElem) {
    bossElem.classList.add('boss-die');
    setTimeout(() => {
        if (gameContainer.contains(bossElem)) {
            gameContainer.removeChild(bossElem);
        }
    }, 700);
}

// 적 총알 생성 함수 추가
function createEnemyBullet(x, y) {
    const bullet = document.createElement('div');
    bullet.className = 'enemyBullet';
    bullet.style.left = (x - 5) + 'px';
    bullet.style.top = y + 'px';
    bullet.dataset.dx = 0;
    bullet.dataset.dy = 5;
    gameContainer.appendChild(bullet);
    enemyBullets.push(bullet);
}

// 적 총알 발사
function enemyShoot() {
    const gameRect = gameContainer.getBoundingClientRect();

    for (let i = 0; i < enemies.length; i++) {
        const enemy = enemies[i];

        if (enemy.type === 'boss') {
            const boss = enemy.element;
            const bossRect = boss.getBoundingClientRect();
            const centerX = bossRect.left - gameRect.left + bossRect.width / 2;
            const startY = bossRect.top - gameRect.top + bossRect.height / 2;

            // 플레이어 중심 좌표
            const playerRect = player.getBoundingClientRect();
            const playerCenterX = playerRect.left - gameRect.left + playerRect.width / 2;
            const playerCenterY = playerRect.top - gameRect.top + playerRect.height / 2;

            // 플레이어 방향 각도
            const angleToPlayer = Math.atan2(playerCenterY - startY, playerCenterX - centerX);

            // 보스 레벨에 따라 총알 개수 증가 (12 + 4 * bossLevel)
            const bossLevel = Math.floor(level / 3);
            const bulletCount = 12 + 4 * (bossLevel - 1); // 3레벨:12, 6레벨:16, 9레벨:20...
            const bulletSpeed = 5;

            for (let j = 0; j < bulletCount; j++) {
                const angle = (Math.PI * 2 / bulletCount) * j;
                const dx = Math.cos(angle) * bulletSpeed;
                const dy = Math.sin(angle) * bulletSpeed;

                const bullet = document.createElement('div');
                bullet.className = 'enemyBullet';
                bullet.style.left = (centerX - 4) + 'px';
                bullet.style.top = (startY - 4) + 'px';
                bullet.dataset.dx = dx;
                bullet.dataset.dy = dy;
                bullet.dataset.fromBoss = "1"; // ← 추가

                gameContainer.appendChild(bullet);
                enemyBullets.push(bullet);
            }
            // 플레이어 방향 추가 발사 (보스 레벨이 높을수록 더 많이)
            for (let k = -bossLevel; k <= bossLevel; k++) {
                const angle = angleToPlayer + (k * Math.PI / 36); // ±5도씩
                const dx = Math.cos(angle) * bulletSpeed * 1.2;
                const dy = Math.sin(angle) * bulletSpeed * 1.2;

                const bullet = document.createElement('div');
                bullet.className = 'enemyBullet';
                bullet.style.left = (centerX - 4) + 'px';
                bullet.style.top = (startY - 4) + 'px';

                bullet.dataset.dx = dx;
                bullet.dataset.dy = dy;

                gameContainer.appendChild(bullet);
                enemyBullets.push(bullet);
            }
        } else {
            // 모든 적이 30% 확률로 공격
            if (Math.random() < 0.3) {
                const enemyRect = enemy.element.getBoundingClientRect();
                createEnemyBullet(
                    enemyRect.left - gameRect.left + enemyRect.width / 2,
                    enemyRect.top - gameRect.top + enemyRect.height
                );
            }
        }
    }
}

// 파워업 생성
function spawnPowerUp() {
    if (Math.random() < 0.3) return; // 30% 확률로 생성 안함
    
    const powerUp = document.createElement('div');
    
    // 파워업 종류 결정
    let powerUpType;
    const rand = Math.random();
    
    if (weaponLevel >= 5) {
        // 무기가 최대 레벨이면 무기 파워업 제외
        powerUpType = rand < 0.5 ? 'healthPowerUp' : 'shieldPowerUp';
    } else {
        if (rand < 0.4) powerUpType = 'healthPowerUp';
        else if (rand < 0.7) powerUpType = 'shieldPowerUp';
        else powerUpType = 'weaponPowerUp';
    }
    
    powerUp.className = 'powerUp ' + powerUpType;
    
    // 위치 설정
    const xPos = Math.random() * (600 - 30);
    powerUp.style.left = xPos + 'px';
    powerUp.style.top = '0px';
    
    gameContainer.appendChild(powerUp);
    powerUps.push({
        element: powerUp,
        type: powerUpType
    });
}

// 폭발 효과
function createExplosion(x, y, size = 60) {
    const explosion = document.createElement('div');
    explosion.className = 'explosion';
    explosion.style.left = (x - size/2) + 'px';
    explosion.style.top = (y - size/2) + 'px';
    explosion.style.width = size + 'px';
    explosion.style.height = size + 'px';
    
    gameContainer.appendChild(explosion);
    explosions.push(explosion);
    
    if (soundEnabled) {
        explosionSound.currentTime = 0;
        explosionSound.play().catch(e => console.log("오디오 재생 실패:", e));
    }
    
    // 0.5초 후 폭발 제거
    setTimeout(() => {
        if (gameContainer.contains(explosion)) {
            gameContainer.removeChild(explosion);
        }
        const index = explosions.indexOf(explosion);
        if (index > -1) {
            explosions.splice(index, 1);
        }
    }, 500);
}

// 알림 표시
function showNotification(text, x, position = 'top', color = '#fff') {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = text;
    notification.style.color = color;
    
    if (position === 'top') {
        notification.style.top = '100px';
    } else {
        notification.style.bottom = '100px';
    }
    
    notification.style.left = x + 'px';
    notification.style.transform = 'translateX(-50%)';
    
    gameContainer.appendChild(notification);
    notifications.push(notification);
    
    // 2초 후 알림 제거
    setTimeout(() => {
        if (gameContainer.contains(notification)) {
            gameContainer.removeChild(notification);
        }
        const index = notifications.indexOf(notification);
        if (index > -1) {
            notifications.splice(index, 1);
        }
    }, 2000);
}

function updateEnemyBullets() {
    for (let i = enemyBullets.length - 1; i >= 0; i--) {
        const bullet = enemyBullets[i];
        let x = parseFloat(bullet.style.left);
        let y = parseFloat(bullet.style.top);
        const dx = parseFloat(bullet.dataset.dx || 0);
        const dy = parseFloat(bullet.dataset.dy || 5); // 기본 아래로

        x += dx;
        y += dy;

        bullet.style.left = x + 'px';
        bullet.style.top = y + 'px';

        if (y > 600 || x < 0 || x > 600) {
            if (gameContainer.contains(bullet)) {
                gameContainer.removeChild(bullet);
            }
            enemyBullets.splice(i, 1);
        }
    }
}

function updatePowerUps() {
    for (let i = powerUps.length - 1; i >= 0; i--) {
        const powerUp = powerUps[i].element;
        const currentTop = parseFloat(powerUp.style.top);
        powerUp.style.top = (currentTop + 2) + 'px'; // 아래로 이동

        if (currentTop > 600) {
            // 화면 밖으로 나간 파워업 제거
            if (gameContainer.contains(powerUp)) {
                gameContainer.removeChild(powerUp);
            }
            powerUps.splice(i, 1);
        }
    }
}

// 파워업 표시 업데이트
function updatePowerUpDisplay() {
    let displayText = `특수 무기: ${specialWeaponAmmo} | `;
    displayText += `무기 레벨: ${weaponLevel}/5 | `;
    displayText += `쉴드: ${shieldCount > 0 ? shieldCount + '개' : '없음'}`;
    powerUpDisplay.innerHTML = displayText;
}

// 충돌 감지
function checkCollisions() {
    // 플레이어 총알과 적의 충돌
    for (let i = bullets.length - 1; i >= 0; i--) {
        const bullet = bullets[i].element;
        const bulletType = bullets[i].type;
        const bulletRect = bullet.getBoundingClientRect();
        const gameRect = gameContainer.getBoundingClientRect();
        
        for (let j = enemies.length - 1; j >= 0; j--) {
            const enemy = enemies[j].element;
            const enemyType = enemies[j].type;
            const enemyRect = enemy.getBoundingClientRect();
            
            if (bulletRect.bottom >= enemyRect.top &&
                bulletRect.top <= enemyRect.bottom &&
                bulletRect.right >= enemyRect.left &&
                bulletRect.left <= enemyRect.right) {
                
                // 총알 타입에 따른 대미지 계산
                let damage = 1;
                if (bulletType === 'powerShot') {
                    damage = 10;
                }
                
                // 적 체력 감소
                enemies[j].health -= damage;
                
                // 일반 총알은 맞으면 사라짐
                if (bulletType !== 'powerShot') {
                    if (gameContainer.contains(bullet)) {
                        gameContainer.removeChild(bullet);
                    }
                    bullets.splice(i, 1);
                }
                
                // 적 체력이 0 이하면 제거
                if (enemies[j].health <= 0) {
                    // 폭발 효과
                    createExplosion(
                        enemyRect.left - gameRect.left + enemyRect.width/2,
                        enemyRect.top - gameRect.top + enemyRect.height/2,
                        enemyType === 'boss' ? 100 : 60
                    );

                    // 점수 추가
                    let pointsGained = 10;
                    if (enemyType === 'enemy2') pointsGained = 20;
                    else if (enemyType === 'enemy3') pointsGained = 30;
                    else if (enemyType === 'boss') pointsGained = 500 * level;

                    addScore(pointsGained); // <-- 여기로 변경

                    // 점수 표시 효과
                    showNotification(
                        '+' + pointsGained,
                        enemyRect.left - gameRect.left + enemyRect.width/2,
                        'top',
                        '#ff0'
                    );
                    
                    // 적 제거
                    if (gameContainer.contains(enemy)) {
                        gameContainer.removeChild(enemy);
                    }
                    enemies.splice(j, 1);
                    
                    // 보스 처치 시 레벨업 제거 (이제 점수로만 레벨업)
                    // 특수 무기 충전 등은 필요시 유지
                    if (enemyType === 'boss') {
                        bossActive = false;
                        bossHealthDisplay.style.display = 'none';
                        
                        // 보스 죽음 애니메이션
                        killBoss(enemy);

                        // 모든 적 제거
                        for (let k = enemies.length - 1; k >= 0; k--) {
                            if (enemies[k].element !== enemy) {
                                gameContainer.removeChild(enemies[k].element);
                            }
                            enemies.splice(k, 1);
                        }

                        // 특수 무기 충전
                        specialWeaponAmmo += 2;
                        updatePowerUpDisplay();

                        // 점수 100점 추가 (레벨업 없음)
                        addScore(100);
                        // 레벨 +1
                        level++;

                        // 타이머 재시작
                        levelTimer = 0;
                        levelTimerPaused = false;
                        lastTimestamp = 0;
                    }
                    // 일반 적 처치시 랜덤하게 파워업 드랍
                    else if (Math.random() < 0.1) {
                        spawnPowerUp();
                    }
                }
                // 보스는 타격 효과 표시
                else if (enemyType === 'boss') {
                    bossHealthFill.style.width = (enemies[j].health / bossMaxHealth * 100) + '%';
                    enemy.style.backgroundColor = '#f77';
                    setTimeout(() => {
                        if (enemies[j] && enemies[j].element === enemy) {
                            enemy.style.backgroundColor = '';
                        }
                    }, 100);
                }
                
                break;
            }
        }
        
        // 총알이 화면 밖으로 나간 경우 제거
        if (bulletRect.top < gameRect.top) {
            if (gameContainer.contains(bullet)) {
                gameContainer.removeChild(bullet);
            }
            bullets.splice(i, 1);
        }
    }
    
    // 적 총알과 플레이어의 충돌
    const playerRect = player.getBoundingClientRect();
    const gameRect = gameContainer.getBoundingClientRect();
    
    for (let i = enemyBullets.length - 1; i >= 0; i--) {
        const bullet = enemyBullets[i];
        const bulletRect = bullet.getBoundingClientRect();

        if (bulletRect.bottom >= playerRect.top &&
            bulletRect.top <= playerRect.bottom &&
            bulletRect.right >= playerRect.left &&
            bulletRect.left <= playerRect.right) {

            // 총알 제거
            if (gameContainer.contains(bullet)) {
                gameContainer.removeChild(bullet);
            }
            enemyBullets.splice(i, 1);

            // 쉴드가 있어도 총알은 막지 않음!
            // 보스 총알은 -20, 일반은 -10
            if (bullet.dataset.fromBoss === "1") {
                takeDamage(20);
            } else {
                takeDamage(10);
            }
            break;
        }
        
        // 화면 밖으로 나간 총알 제거
        if (bulletRect.bottom > gameRect.bottom) {
            gameContainer.removeChild(bullet);
            enemyBullets.splice(i, 1);
        }
    }
    
    // 적과 플레이어의 충돌
    for (let i = enemies.length - 1; i >= 0; i--) {
        const enemy = enemies[i].element;
        const enemyRect = enemy.getBoundingClientRect();
        
        if (playerRect.bottom >= enemyRect.top &&
            playerRect.top <= enemyRect.bottom &&
            playerRect.right >= enemyRect.left &&
            playerRect.left <= enemyRect.right) {
            
            // 쉴드가 있으면 적만 파괴, 쉴드 소모
            if (hasShield && shieldCount > 0) {
                consumeShield();
                showNotification('쉴드로 충돌 무효화!', playerPosition + playerWidth/2, 'bottom', '#0ff');
                createExplosion(
                    enemyRect.left - gameRect.left + enemyRect.width/2,
                    enemyRect.top - gameRect.top + enemyRect.height/2
                );
                // 보스가 아닌 경우만 즉시 파괴
                if (enemies[i].type !== 'boss') {
                    gameContainer.removeChild(enemy);
                    enemies.splice(i, 1);
                    continue;
                }
            } else {
                // 쉴드 없으면 체력 감소
                takeDamage(20);
            }
            break;
        }
    }
    
    // 파워업과 플레이어의 충돌
    for (let i = powerUps.length - 1; i >= 0; i--) {
        const powerUp = powerUps[i].element;
        const powerUpRect = powerUp.getBoundingClientRect();
        
        if (playerRect.bottom >= powerUpRect.top &&
            playerRect.top <= powerUpRect.bottom &&
            playerRect.right >= powerUpRect.left &&
            playerRect.left <= powerUpRect.right) {
            
            // 파워업 타입에 따른 효과
            const powerUpType = powerUps[i].type;
            
            if (powerUpType === 'healthPowerUp') {
                health = Math.min(health + 20, 200); // 최대 200까지 허용
                healthFill.style.width = Math.min(health, 100) + '%'; // 시각적 제한은 100%
                healthElement.firstChild.nodeValue = '체력: ' + health;
                showNotification('+20 체력', playerPosition + playerWidth / 2, 'bottom', '#0f0');
            }
            else if (powerUpType === 'shieldPowerUp') {
                activateShield();
                showNotification('쉴드 획득!', playerPosition + playerWidth/2, 'bottom', '#0ff');
            }
            else if (powerUpType === 'weaponPowerUp') {
                if (weaponLevel < 5) {
                    weaponLevel++;
                    updatePowerUpDisplay();
                    showNotification('무기 업그레이드!', playerPosition + playerWidth/2, 'bottom', '#f0f');
                } else {
                    specialWeaponAmmo++;
                    updatePowerUpDisplay();
                    showNotification('특수무기 +1', playerPosition + playerWidth/2, 'bottom', '#f0f');
                }
            }
            
            if (soundEnabled) {
                powerUpSound.currentTime = 0;
                powerUpSound.play().catch(e => console.log("오디오 재생 실패:", e));
            }
            
            // 파워업 제거
            if (gameContainer.contains(powerUp)) {
                gameContainer.removeChild(powerUp);
            }
            powerUps.splice(i, 1);
        }
        
        // 화면 밖으로 나간 파워업 제거
        if (powerUpRect.top > gameRect.bottom) {
            if (gameContainer.contains(powerUp)) {
                gameContainer.removeChild(powerUp);
            }
            powerUps.splice(i, 1);
        }
    }
}

// 점수 추가 및 레벨업 체크 함수 (1,2,3... 순차 증가)
function addScore(points) {
    score += points;
    scoreElement.textContent = '점수: ' + score;
    // 레벨업은 시간으로만!
}

// 체력 감소 함수
function takeDamage(amount) {
    if (hasShield && shieldCount > 0) {
        consumeShield();
        showNotification('쉴드로 피해 무효화!', playerPosition + playerWidth/2, 'bottom', '#0ff');
        return;
    }
    health -= amount;
    healthFill.style.width = Math.max(health, 0) + '%';
    healthElement.firstChild.nodeValue = '체력: ' + health;

    if (soundEnabled) {
        hurtSound.currentTime = 0;
        hurtSound.play().catch(e => console.log("오디오 재생 실패:", e));
    }

    // 플레이어 히트 애니메이션
    if (!hitAnimationActive) {
        hitAnimationActive = true;
        playerShip.style.backgroundColor = '#f00';
        gameContainer.style.boxShadow = '0 0 20px #f00, 0 0 40px #f00';
        setTimeout(() => {
            playerShip.style.backgroundColor = '';
            gameContainer.style.boxShadow = '0 0 20px #00f, 0 0 40px #00f';
            hitAnimationActive = false;
        }, 200);
    }

    if (health <= 0) {
        gameOver();
    }
}

// 게임 오버 함수
function gameOver() {
    isGameOver = true;
    gameOverElement.style.display = 'block';
    finalScoreElement.textContent = score;

    if (soundEnabled) {
        bgm.pause();
    }

    // 모든 게임 루프 정지
    cancelAnimationFrame(gameLoopId);
}

// 레벨 업 함수
function levelUp() {
    levelElement.textContent = '레벨: ' + level;

    if (soundEnabled) {
        levelUpSound.currentTime = 0;
        levelUpSound.play().catch(e => console.log("오디오 재생 실패:", e));
    }

    levelUpElement.style.display = 'block';
    newLevelElement.textContent = level;

    gamePaused = true;

    // 1.5초 후 자동으로 알림 사라지고 게임 재개
    setTimeout(() => {
        levelUpElement.style.display = 'none';
        gamePaused = false;
        levelTimerPaused = false; // ★ 추가: 레벨업 후 타이머 재개
        gameLoop();
    }, 1500);
}

// 쉴드 활성화 함수 (최대 2개까지만)
function activateShield() {
    if (shieldCount >= 2) {
        showNotification('쉴드는 최대 2개까지!', playerPosition + playerWidth/2, 'bottom', '#0ff');
        return;
    }
    shieldCount++;
    hasShield = true;
    updatePowerUpDisplay();

    // 쉴드 시각적 표시 중복 방지
    if (player.querySelectorAll('.shield').length < shieldCount) {
        const shield = document.createElement('div');
        shield.className = 'shield';
        player.appendChild(shield);
    }
}

// 쉴드 소모(피격 시 1개씩 감소, 0이 되면 해제)
function consumeShield() {
    if (shieldCount > 0) {
        shieldCount--;
        if (player.querySelector('.shield')) {
            player.removeChild(player.querySelector('.shield'));
        }
        if (shieldCount === 0) {
            hasShield = false;
        }
        updatePowerUpDisplay();
    }
}

// 게임 초기화 함수
function resetGame() {
    // 초기 상태로 리셋
    score = 0;
    level = 1;
    health = 100;
    isGameOver = false;
    gameStarted = false;
    gamePaused = false;
    playerPosition = 270;
    bullets = [];
    enemyBullets = [];
    enemies = [];
    explosions = [];
    powerUps = [];
    stars = [];
    notifications = [];
    lastEnemySpawn = 0;
    lastEnemyShot = 0;
    lastPowerUpSpawn = 0;
    enemySpawnRate = 1500;
    enemyShootRate = 2000;
    powerUpSpawnRate = 10000;
    bossActive = false;
    bossHealth = 1000;
    bossMaxHealth = 1000;
    weaponLevel = 1;
    specialWeaponAmmo = 3;
    hasShield = false;
    shieldTime = 0;
    specialWeaponCooldown = 0;

    // UI 초기화
    scoreElement.textContent = '점수: 0';
    levelElement.textContent = '레벨: 1';
    healthElement.firstChild.nodeValue = '체력: 100';
    healthFill.style.width = '100%';
    powerUpDisplay.innerHTML = '';
    bossHealthDisplay.style.display = 'none';
    gameOverElement.style.display = 'none';
    levelUpElement.style.display = 'none';
    bossWarningElement.style.display = 'none';

    // 게임 컨테이너 초기화
    while (gameContainer.firstChild) {
        gameContainer.removeChild(gameContainer.firstChild);
    }

    // 플레이어 추가
    gameContainer.appendChild(player);
    gameContainer.appendChild(scoreElement);
    gameContainer.appendChild(levelElement);
    gameContainer.appendChild(healthElement);
    gameContainer.appendChild(powerUpDisplay);
    gameContainer.appendChild(bossHealthDisplay);
    gameContainer.appendChild(gameOverElement);
    gameContainer.appendChild(levelUpElement);
    gameContainer.appendChild(bossWarningElement);
    gameContainer.appendChild(soundButton);

    // 별 생성
    createStars();

    // 게임 시작
    startScreen.style.display = 'flex';

    gameStarted = true;
    createStars();
    updatePowerUpDisplay();
    gameLoop();
}

// 게임 루프
let gameLoopId;
function gameLoop(timestamp = 0) {
    if (isGameOver || gamePaused) return;

    // 특수 무기 쿨다운 감소
    if (specialWeaponCooldown > 0) {
        specialWeaponCooldown -= (timestamp - lastTimestamp);
        if (specialWeaponCooldown < 0) specialWeaponCooldown = 0;
    }

    // 타이머 관리
    if (!levelTimerPaused) {
        if (lastTimestamp === 0) lastTimestamp = timestamp;
        levelTimer += (timestamp - lastTimestamp);
    }
    lastTimestamp = timestamp;

    // 12초마다 레벨업 (보스전 아닐 때만)
    if (!bossActive && !levelTimerPaused && levelTimer >= levelUpInterval) {
        levelTimer = 0;
        level++;
        levelUp();
    }

    // 적 생성 (보스가 없을 때만)
    if (!bossActive && timestamp - lastEnemySpawn > enemySpawnRate) {
        spawnEnemy();
        lastEnemySpawn = timestamp;
    }

    // 보스 출현 조건 (3, 6, 9...)
    if (!bossActive && level % 3 === 0 && enemies.length === 0 && !levelTimerPaused) {
        spawnBoss();
        levelTimerPaused = true; // 타이머 일시정지
    }

    // 적 총알 발사
    if (timestamp - lastEnemyShot > enemyShootRate) {
        enemyShoot();
        lastEnemyShot = timestamp;
    }

    // 파워업 생성
    if (timestamp - lastPowerUpSpawn > powerUpSpawnRate) {
        spawnPowerUp();
        lastPowerUpSpawn = timestamp;
    }

    // 별 업데이트
    updateStars();

    // 총알 이동
    updateBullets();

    // 적 이동
    updateEnemies();

    // 별, 총알, 적 등 업데이트 다음에 추가
    updatePowerUps();

    updateEnemyBullets(); 

    // 플레이어 이동
    if (keys.left && playerPosition > 0) {
        playerPosition -= 5;
    }
    if (keys.right && playerPosition < 600 - playerWidth) {
        playerPosition += 5;
    }
    if (keys.up && playerVerticalPosition > 0) { // 위로 이동
        playerVerticalPosition -= 5;
    }
    if (keys.down && playerVerticalPosition < 600 - playerHeight) { // 아래로 이동
        playerVerticalPosition += 5;
    }
    player.style.left = playerPosition + 'px';
    player.style.top = playerVerticalPosition + 'px';

    // 충돌 감지
    checkCollisions();

    // 다음 프레임 요청
    gameLoopId = requestAnimationFrame(gameLoop);
}