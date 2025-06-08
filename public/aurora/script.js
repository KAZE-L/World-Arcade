const auroras = document.querySelectorAll('.aurora');
const captureBtn = document.getElementById('capture-btn');
const resultMsg = document.getElementById('result-msg');
const scoreDisplay = document.getElementById('score');

let auroraVisible = false;
let currentAurora = null;
let isGameRunning = true;
let score = 0;

// 檢查圖片是否載入
auroras.forEach(aurora => {
  aurora.addEventListener('error', () => {
    console.error(`Failed to load image: ${aurora.src}`);
  });
});

function randomAurora() {
  if (!isGameRunning) return;

  setTimeout(() => {
    if (!auroraVisible) {
      showAurora();
      console.log(`[${new Date().toISOString()}] Aurora shown: ${currentAurora.id}`);
      setTimeout(() => {
        hideAurora();
        console.log(`[${new Date().toISOString()}] Aurora hidden: ${currentAurora ? currentAurora.id : 'none'}`);
        randomAurora();
      }, 1000 + Math.random() * 2000); // 顯示 1-3 秒
    } else {
      console.log(`[${new Date().toISOString()}] Skipped showAurora: aurora already visible`);
      randomAurora();
    }
  }, 2000 + Math.random() * 3000); // 間隔 2-5 秒
}

function showAurora() {
  // 確保所有極光隱藏
  auroras.forEach(a => a.classList.add('hidden'));
  const randomIndex = Math.floor(Math.random() * auroras.length);
  const aurora = auroras[randomIndex];

  // 隨機大小與位置
  const randomScale = 0.7 + Math.random() * 1.3;
  const maxX = Math.max(0, window.innerWidth - 300 * randomScale);
  const maxY = Math.max(0, window.innerHeight * 0.5 - 300 * randomScale);
  const randomX = Math.random() * maxX;
  const randomY = Math.random() * maxY + 50;

  aurora.style.width = `${300 * randomScale}px`;
  aurora.style.left = `${randomX}px`;
  aurora.style.top = `${randomY}px`;
  aurora.classList.remove('hidden');
  currentAurora = aurora;
  auroraVisible = true;
}

function hideAurora() {
  if (currentAurora) {
    currentAurora.classList.add('hidden');
    currentAurora = null;
  }
  auroraVisible = false;
}

function endGame() {
  isGameRunning = false;
  auroras.forEach(a => a.classList.add('hidden'));
  captureBtn.disabled = true;
  resultMsg.textContent = `🎉 遊戲結束！`;
  console.log(`[${new Date().toISOString()}] Game ended, final score: ${score}`);
}

captureBtn.addEventListener('click', () => {
  if (!isGameRunning) return;

  if (auroraVisible && currentAurora && !currentAurora.classList.contains('hidden')) {
    score += 10;
    scoreDisplay.textContent = `分數: ${score}`;
    resultMsg.textContent = '🥳 成功捕捉到極光！';
    console.log(`[${new Date().toISOString()}] Captured aurora: ${currentAurora.id}, Score: ${score}`);
    hideAurora();
    if (score >= 100) {
      endGame();
    } else {
      setTimeout(randomAurora, 1000); // 縮短下次出現間隔
    }
  } else {
    resultMsg.textContent = '😭 錯過了極光...';
    console.log(`[${new Date().toISOString()}] Missed aurora`);
  }

  setTimeout(() => {
    if (isGameRunning) resultMsg.textContent = '';
  }, 1500);
});

// 防止按鈕連點
let isButtonLocked = false;
captureBtn.addEventListener('click', () => {
  if (isButtonLocked) return;
  isButtonLocked = true;
  setTimeout(() => {
    isButtonLocked = false;
  }, 500);
});

// 螢幕大小改變時重新計算位置
window.addEventListener('resize', () => {
  if (auroraVisible) {
    hideAurora();
    showAurora();
  }
});

// 開始遊戲
console.log(`[${new Date().toISOString()}] Game started`);
randomAurora();