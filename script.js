const gameArea = document.getElementById('gameArea');
const killCountEl = document.getElementById('killCount');
const timerEl = document.getElementById('timer');
const bgMusic = document.getElementById('bgMusic');
const squashSound = document.getElementById('squashSound');
let kills = 0;
let spawnRate = 2000;
let gameInterval, spawnInterval;
let gameStarted = false;
let countdown = 60;
let highScore = localStorage.getItem('highScore') || 0;
document.getElementById('highScore').textContent = `High Score: ${highScore}`;

// Function to randomly speed up the game
function randomSpeedUp() {
  const randomInterval = Math.random() * 10000 + 5000; // Random interval between 5-15 seconds
  setTimeout(() => {
    if (spawnRate > 500) {
      spawnRate -= 200; // Decrease spawn rate to make the game faster
      console.log(`Speeding up! New spawn rate: ${spawnRate}ms`);
      showSpeedUpSign(); // Show the speed-up sign
    }
    randomSpeedUp(); // Call the function again for continuous random speed-ups
  }, randomInterval);
}

function showSpeedUpSign() {
  const speedUpSign = document.createElement('div');
  speedUpSign.id = 'speedUpSign';
  speedUpSign.textContent = 'Speeding Up!';
  speedUpSign.style.position = 'fixed';
  speedUpSign.style.top = '50%';
  speedUpSign.style.left = '50%';
  speedUpSign.style.transform = 'translate(-50%, -50%)';
  speedUpSign.style.fontSize = '36px';
  speedUpSign.style.fontWeight = 'bold';
  speedUpSign.style.color = 'red';
  speedUpSign.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
  speedUpSign.style.padding = '20px';
  speedUpSign.style.borderRadius = '10px';
  speedUpSign.style.zIndex = '1000';
  speedUpSign.style.textAlign = 'center';
  document.body.appendChild(speedUpSign);

  // Remove the sign after 2 seconds
  setTimeout(() => {
    speedUpSign.remove();
  }, 2000);
}

setInterval(() => {
  if (spawnRate > 500) spawnRate -= 200;
}, 10000);

const spawnedPositions = [];

function spawnCockroach() {
  if (countdown < 0) return;

  const containerRect = document.getElementById('centerContainer').getBoundingClientRect();
  let left, top, overlapping;
  do {
    overlapping = false;
    left = Math.random() * (containerRect.width - 80) + containerRect.left + 10;
    top = Math.random() * (containerRect.height - 80) + containerRect.top + 10;

    for (const pos of spawnedPositions) {
      if (Math.abs(pos.left - left) < 60 && Math.abs(pos.top - top) < 60) {
        overlapping = true;
        break;
      }
    }
  } while (overlapping);

  const cockroach = document.createElement('img');
  cockroach.src = 'assets/img/cockroach.png';
  cockroach.className = 'cockroach';
  cockroach.style.left = `${left - containerRect.left}px`;
  cockroach.style.top = `${top - containerRect.top}px`;

  // Add click event to kill the cockroach
  cockroach.onclick = function () {
    this.src = 'assets/img/dead-cockroach.png';
    this.classList.add('dead');
    squashSound.currentTime = 0;
    squashSound.play();
    kills++;
    killCountEl.textContent = `Kills: ${kills}`;
    setTimeout(() => {
      this.remove();
      spawnedPositions.splice(spawnedPositions.indexOf({ left, top }), 1);
    }, 1000);
  };

  // Remove the cockroach if not clicked within 1 second
  const removeTimeout = setTimeout(() => {
    if (document.body.contains(cockroach)) {
      cockroach.remove();
      spawnedPositions.splice(spawnedPositions.indexOf({ left, top }), 1);
    }
  }, 1000); // 1 second

  document.getElementById('gameArea').appendChild(cockroach);
  spawnedPositions.push({ left, top });
  spawnInterval = setTimeout(spawnCockroach, spawnRate);
}

document.getElementById('startBtn').onclick = function () {
  if (gameStarted) return;
  gameStarted = true;
  this.style.display = 'none';
  bgMusic.play();
  startGame();
};

function startGame() {

  gameInterval = setInterval(() => {
    timerEl.textContent = `Time: ${countdown}s`;
    countdown--;
    if (countdown < 0) endGame();
  }, 1000);


  spawnCockroach();
  randomSpeedUp(); // Start the random speed-up mechanism
}

function endGame() {
  clearInterval(gameInterval);
  clearTimeout(spawnInterval);
  bgMusic.pause();

  
  if (kills > highScore) {
    highScore = kills;
    localStorage.setItem('highScore', highScore);
  }

  document.getElementById('gameOver').style.display = 'block';
  document.getElementById('finalScore').textContent = `Your Score: ${kills}`;
  document.getElementById('finalHighScore').textContent = `High Score: ${highScore}`;
}

function restartGame() {
  location.reload();
}


function toggleAudio() {
  bgMusic.muted = !bgMusic.muted;
  document.getElementById('muteBtn').textContent = bgMusic.muted ? 'Unmute' : 'Mute';
}


window.addEventListener('offline', () => {
  alert('You are offline!');
});
