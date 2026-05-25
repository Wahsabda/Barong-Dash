// =========================
// CANVAS
// =========================
const canvas = document.getElementById("gameCanvas");

const ctx = canvas.getContext("2d");

// =========================
// RESIZE CANVAS
// =========================
function resizeCanvas() {
  canvas.width = window.innerWidth;

  canvas.height = window.innerHeight;
}

resizeCanvas();

window.addEventListener("resize", resizeCanvas);

// =========================
// HTML ELEMENTS
// =========================
const startMenu = document.getElementById("startMenu");

const startBtn = document.getElementById("startBtn");

const pauseBtn = document.getElementById("pauseBtn");

const restartBtn = document.getElementById("restartBtn");

const gameOverScreen = document.getElementById("gameOverScreen");

const finalScore = document.getElementById("finalScore");

const scoreEl = document.getElementById("score");

const highScoreEl = document.getElementById("highScore");

const lifeEl = document.getElementById("life");

const bossUI = document.getElementById("bossUI");

const bossHpEl = document.getElementById("bossHp");

const attackBtn = document.getElementById("attackBtn");

const jumpBtn = document.getElementById("jumpBtn");

const victoryPopup = document.getElementById("victoryPopup");

const resumeBtn = document.getElementById("resumeBtn");

const pausePopup = document.getElementById("pausePopup");

const resumeGameBtn = document.getElementById("resumeGameBtn");

const storyPopup = document.getElementById("storyPopup");

const continueBtn = document.getElementById("continueBtn");

const countdownEl = document.getElementById("countdown");

// =========================
// GAME STATE
// =========================
let gameStarted = false;

let gameOver = false;

let isPaused = false;

let bossFight = false;

let lastBossScore = 0;

// =========================
// SCORE
// =========================
let score = 0;

let highScore = localStorage.getItem("highScore") || 0;

// =========================
// LIFE
// =========================
let life = 3;

// =========================
// BACKGROUND
// =========================
const bg = new Image();
bg.src = "assets/bg.png";

const bg1 = new Image();
bg1.src = "assets/bg1.png";

const bg2 = new Image();
bg2.src = "assets/bg2.png";

const bg3 = new Image();
bg3.src = "assets/bg3.png";

// =========================
// ACTIVE BG
// =========================
let currentBackground = bg;

// =========================
// BG SCROLL
// =========================
let bgX = 0;

let bgSpeed = 1;

// =========================
// WAR BG
// =========================
const bgWar = new Image();

bgWar.src = "assets/bgwar.png";

// =========================
// PLAYER IMAGE
// =========================
const playerImg = new Image();

playerImg.src = "assets/player.png";

// =========================
// OBSTACLE IMAGE
// =========================
const obstacleImg = new Image();

obstacleImg.src = "assets/obstacle.png";

// =========================
// CLOUD IMAGE
// =========================
const cloudImg = new Image();

cloudImg.src = "assets/cloud.png";

// =========================
// BOSS IMAGE
// =========================
const bossImg = new Image();

bossImg.src = "assets/bos.png";

// =========================
// SOUND
// =========================
const jumpSound = new Audio("assets/sfx/jump.mp3");

const hitSound = new Audio("assets/sfx/hit.mp3");

const bossHitSound = new Audio("assets/sfx/bosshit.mp3");

const victorySound = new Audio("assets/sfx/victory.mp3");

const gameOverSound = new Audio("assets/sfx/gameover.mp3");

// =========================
// MUSIC
// =========================
const bgMusic = new Audio("assets/music/bgmusic.mp3");

bgMusic.loop = true;

bgMusic.volume = 0.3;

// =========================
// PLAYER
// =========================
const player = {
  x: 120,

  y: canvas.height - 260,

  width: 220,

  height: 220,

  dy: 0,

  gravity: 0.4,

  jumpPower: -20,

  grounded: false,
};

// =========================
// OBSTACLE
// =========================
const obstacle = {
  x: canvas.width + 300,

  y: canvas.height - 220,

  width: 220,

  height: 220,

  speed: 8,
};

const boss = {
  x: canvas.width - 480,

  y: canvas.height - 520,

  width: 420,

  height: 420,

  hp: 5,

  direction: 1,

  moveSpeed: 2,
};

// =========================
// CLOUDS
// =========================
let clouds = [
  {
    x: 100,
    y: 120,
    speed: 0.3,
  },

  {
    x: 700,
    y: 160,
    speed: 0.4,
  },

  {
    x: 1200,
    y: 90,
    speed: 0.5,
  },
];

// =========================
// PARTICLES
// =========================
let particles = [];

// =========================
// CREATE PARTICLES
// =========================
function createParticles(x, y, color, amount) {
  for (let i = 0; i < amount; i++) {
    particles.push({
      x: x,

      y: y,

      size: Math.random() * 8 + 4,

      color: color,

      speedX: (Math.random() - 0.5) * 8,

      speedY: (Math.random() - 0.5) * 8,

      life: 40,
    });
  }
}

// =========================
// UPDATE PARTICLES
// =========================
function updateParticles() {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];

    p.x += p.speedX;

    p.y += p.speedY;

    p.life--;

    ctx.globalAlpha = p.life / 40;

    ctx.fillStyle = p.color;

    ctx.beginPath();

    ctx.arc(
      p.x,

      p.y,

      p.size,

      0,

      Math.PI * 2,
    );

    ctx.fill();

    ctx.globalAlpha = 1;

    if (p.life <= 0) {
      particles.splice(i, 1);
    }
  }
}

// =========================
// SHAKE
// =========================
let shakePower = 0;

let shakeTime = 0;

// =========================
// FLASH
// =========================
let playerFlash = 0;

let bossFlash = 0;

// BOSS INTRO
let bossIntro = false;

let introTimer = 0;

// ATTACK TIMER
let attackTimeout;

// =========================
// DRAW GROUND
// =========================
function drawGround() {
  // kosong
}

// =========================
// START BUTTON
// =========================
startBtn.addEventListener("click", () => {
  startMenu.style.display = "none";

  storyPopup.style.display = "flex";
});

// =========================
// CONTINUE STORY
// =========================
continueBtn.addEventListener("click", () => {
  storyPopup.style.display = "none";

  bgMusic.currentTime = 0;

  bgMusic.play().catch(() => {
    console.log("music blocked");
  });

  startCountdown();
});

// =========================
// PAUSE
// =========================
pauseBtn.addEventListener("click", () => {
  if (gameOver || !gameStarted) return;

  isPaused = true;

  pausePopup.style.display = "flex";
});

// =========================
// RESUME
// =========================
resumeGameBtn.addEventListener("pointerdown", () => {
  isPaused = false;

  pausePopup.style.display = "none";
});

// =========================
// RESTART
// =========================
restartBtn.addEventListener("click", () => {
  gameOverScreen.style.display = "none";

  resetGame();
});

// =========================
// RESUME AFTER BOSS
// =========================
resumeBtn.addEventListener("click", () => {
  victoryPopup.style.display = "none";

  bossFight = false;

  attackBtn.style.display = "none";

  bossUI.style.display = "none";

  obstacle.x = canvas.width + 400;

  obstacle.speed = 8 + score * 0.2;
});

// =========================
// JUMP
// =========================
function jump() {
  if (player.grounded && !gameOver && !isPaused && !bossFight) {
    player.dy = player.jumpPower;

    player.grounded = false;

    jumpSound.currentTime = 0;

    jumpSound.play();
  }
}

// =========================
// KEYBOARD
// =========================
document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    jump();
  }
});

// =========================
// MOBILE JUMP
// =========================
jumpBtn.addEventListener("pointerdown", () => {
  jump();
});

// =========================
// ATTACK BUTTON
// =========================
attackBtn.addEventListener("pointerdown", () => {
  if (!bossFight || gameOver) return;

  // DAMAGE
  boss.hp--;

  // UPDATE HP
  bossHpEl.innerText = "❤️".repeat(boss.hp);

  // EFFECT
  bossFlash = 10;

  bossHitSound.currentTime = 0;

  bossHitSound.play();

  // PARTICLE EFFECT
  createParticles(
    boss.x + boss.width / 2,

    boss.y + boss.height / 2,

    "red",

    20,
  );

  startShake(12, 12);

  // HIDE BUTTON
  attackBtn.style.display = "none";

  // CLEAR TIMER
  clearTimeout(attackTimeout);

  // =========================
  // BOSS DEAD
  // =========================
  if (boss.hp <= 0) {
    victorySound.play();

    bossFight = false;

    bossUI.style.display = "none";

    attackBtn.style.display = "none";

    victoryPopup.style.display = "flex";
  }

  // =========================
  // RANDOM BUTTON AGAIN
  // =========================
  else {
    setTimeout(() => {
      if (bossFight && boss.hp > 0) {
        const randomX = Math.random() * (window.innerWidth - 160);

        const randomY = Math.random() * (window.innerHeight - 160);

        attackBtn.style.left = randomX + "px";

        attackBtn.style.top = randomY + "px";

        attackBtn.style.display = "flex";

        // START TIMER AGAIN
        startAttackTimer();
      }
    }, 700);
  }
});

// =========================
// COUNTDOWN
// =========================
function startCountdown() {
  countdownEl.style.display = "flex";

  let count = 3;

  countdownEl.innerText = count;

  let interval = setInterval(() => {
    count--;

    if (count <= 0) {
      countdownEl.innerText = "MULAI!";
    } else {
      countdownEl.innerText = count;
    }

    if (count < 0) {
      clearInterval(interval);

      countdownEl.style.display = "none";

      document.getElementById("ui").style.display = "flex";

      resetGame();
    }
  }, 1000);
}

// =========================
// RESET GAME
// =========================
function resetGame() {
  gameStarted = true;

  gameOver = false;

  isPaused = false;

  bossFight = false;

  score = 0;

  lastBossScore = 0;

  life = 3;

  scoreEl.innerText = score;

  highScoreEl.innerText = highScore;

  lifeEl.innerText = life;

  player.y = canvas.height - 260;

  player.dy = 0;

  player.grounded = true;

  obstacle.x = canvas.width + 300;

  obstacle.y = canvas.height - 220;

  obstacle.speed = 8;

  boss.hp = 5;

  bossUI.style.display = "none";

  attackBtn.style.display = "none";

  pausePopup.style.display = "none";

  bgX = 0;

  bgSpeed = 1;

  currentBackground = bg;
}

// =========================
// SHAKE
// =========================
function startShake(power, duration) {
  shakePower = power;

  shakeTime = duration;
}

// =========================
// DRAW BACKGROUND
// =========================
function drawBackground() {
  if (score < 15) {
    currentBackground = bg;
  } else if (score >= 15 && score < 30) {
    currentBackground = bg1;
  } else if (score >= 30 && score < 45) {
    currentBackground = bg2;
  } else if (score >= 45) {
    currentBackground = bg3;
  }

  // BOSS BG
  if (bossFight) {
    ctx.drawImage(
      bgWar,

      0,
      0,

      canvas.width,
      canvas.height,
    );

    return;
  }

  bgX -= bgSpeed;

  const bgWidth = canvas.width;

  const bgHeight = canvas.height;

  if (bgX <= -bgWidth) {
    bgX = 0;
  }

  ctx.drawImage(
    currentBackground,

    bgX,
    0,

    bgWidth,
    bgHeight,
  );

  ctx.drawImage(
    currentBackground,

    bgX + bgWidth,
    0,

    bgWidth,
    bgHeight,
  );
}

// =========================
// DRAW CLOUDS
// =========================
function drawClouds() {
  clouds.forEach((cloud) => {
    if (!isPaused) {
      cloud.x -= cloud.speed;
    }

    if (cloud.x < -300) {
      cloud.x = canvas.width + 300;
    }

    ctx.drawImage(
      cloudImg,

      cloud.x,
      cloud.y,

      250,
      140,
    );
  });
}

// =========================
// UPDATE PLAYER
// =========================
function updatePlayer() {
  player.y += player.dy;

  player.dy += player.gravity;

  if (player.y >= canvas.height - 260) {
    player.y = canvas.height - 260;

    player.dy = 0;

    player.grounded = true;
  }
}

// =========================
// DRAW PLAYER
// =========================
function drawPlayer() {
  ctx.globalAlpha = 1;

  if (playerFlash > 0) {
    playerFlash--;

    ctx.globalAlpha = 0.5;
  }

  ctx.drawImage(
    playerImg,

    player.x,

    player.y,

    player.width,

    player.height,
  );

  ctx.globalAlpha = 1;
}

// =========================
// UPDATE OBSTACLE
// =========================
function updateObstacle() {
  if (bossFight) return;

  if (bossIntro) {
    obstacle.x -= obstacle.speed * 0.2;
  } else {
    obstacle.x -= obstacle.speed;
  }

  if (obstacle.x < -obstacle.width) {
    obstacle.x = canvas.width + 300;

    score++;

    scoreEl.innerText = score;

    obstacle.speed = 8 + score * 0.2;

    bgSpeed = 1 + score * 0.03;

    // HIGH SCORE
    if (score > highScore) {
      highScore = score;

      localStorage.setItem("highScore", highScore);

      highScoreEl.innerText = highScore;
    }

    // =========================
    // BOSS EVERY 10 SCORE
    // =========================
    if (
      score > 0 &&
      score % 10 === 0 &&
      score !== lastBossScore &&
      !bossFight
    ) {
      lastBossScore = score;

      startBossFight();
    }
  }
}

// =========================
// DRAW OBSTACLE
// =========================
function drawObstacle() {
  if (bossFight) return;

  ctx.drawImage(
    obstacleImg,

    obstacle.x,

    obstacle.y,

    obstacle.width,

    obstacle.height,
  );
}

// =========================
// START BOSS FIGHT
// =========================
function startBossFight() {
  bossFight = true;

  // WARNING SHAKE
  startShake(20, 20);

  // INTRO
  bossIntro = true;

  introTimer = 120;

  // BIG SHAKE
  startShake(25, 25);

  boss.hp = 5;

  obstacle.x = canvas.width + 9999;

  bossUI.style.display = "flex";

  attackBtn.style.display = "flex";

  // START ATTACK TIMER
  startAttackTimer();

  bossHpEl.innerText = "❤️".repeat(boss.hp);

  // RANDOM ATTACK BUTTON
  const randomX = Math.random() * (window.innerWidth - 180);

  const randomY = Math.random() * (window.innerHeight - 180);

  attackBtn.style.left = randomX + "px";

  attackBtn.style.top = randomY + "px";
}

// =========================
// ATTACK TIMER
// =========================
function startAttackTimer() {
  // CLEAR TIMER LAMA
  clearTimeout(attackTimeout);

  attackTimeout = setTimeout(() => {
    // JIKA TOMBOL MASIH ADA
    if (bossFight && attackBtn.style.display === "flex") {
      // HIDE BUTTON
      attackBtn.style.display = "none";

      // PLAYER DAMAGE
      life--;

      lifeEl.innerText = life;

      // EFFECT
      playerFlash = 10;

      hitSound.currentTime = 0;

      hitSound.play();

      startShake(15, 15);

      // GAME OVER
      if (life <= 0) {
        gameOver = true;

        gameStarted = false;

        gameOverSound.play();

        finalScore.innerText = score;

        gameOverScreen.style.display = "flex";

        return;
      }

      // RANDOM BUTTON AGAIN
      setTimeout(() => {
        if (bossFight && boss.hp > 0) {
          const randomX = Math.random() * (window.innerWidth - 160);

          const randomY = Math.random() * (window.innerHeight - 160);

          attackBtn.style.left = randomX + "px";

          attackBtn.style.top = randomY + "px";

          attackBtn.style.display = "flex";

          // TIMER AGAIN
          startAttackTimer();
        }
      }, 600);
    }
  }, 3000);
}

// =========================
// UPDATE BOSS
// =========================
function updateBoss() {
  if (!bossFight) return;

  boss.x += boss.moveSpeed * boss.direction;

  if (boss.x < canvas.width - 700) {
    boss.direction = 1;
  }

  if (boss.x > canvas.width - 450) {
    boss.direction = -1;
  }
}

// =========================
// DRAW BOSS
// =========================
function drawBoss() {
  if (!bossFight) return;

  ctx.globalAlpha = 1;

  if (bossFlash > 0) {
    bossFlash--;

    ctx.globalAlpha = 0.5;
  }

  ctx.drawImage(
    bossImg,

    boss.x,

    boss.y,

    boss.width,

    boss.height,
  );

  ctx.globalAlpha = 1;
}

// =========================
// COLLISION
// =========================
function checkCollision() {
  if (bossFight) return;

  if (
    player.x < obstacle.x + obstacle.width &&
    player.x + player.width > obstacle.x &&
    player.y < obstacle.y + obstacle.height &&
    player.y + player.height > obstacle.y
  ) {
    obstacle.x = canvas.width + 300;

    life--;

    playerFlash = 10;

    hitSound.currentTime = 0;

    hitSound.play();

    lifeEl.innerText = life;

    startShake(12, 12);

    // RANDOM BUTTON AGAIN
    setTimeout(() => {
      if (bossFight && boss.hp > 0) {
        const randomX = Math.random() * (window.innerWidth - 160);

        const randomY = Math.random() * (window.innerHeight - 160);

        attackBtn.style.left = randomX + "px";

        attackBtn.style.top = randomY + "px";

        attackBtn.style.display = "flex";
      }
    }, 700);

    if (life <= 0) {
      gameOver = true;

      gameStarted = false;

      gameOverSound.play();

      finalScore.innerText = score;

      gameOverScreen.style.display = "flex";
    }
  }
}

// =========================
// MAIN UPDATE
// =========================
function update() {
  if (!gameStarted || gameOver || isPaused) {
    requestAnimationFrame(update);

    return;
  }

  // CLEAR
  ctx.clearRect(
    0,
    0,

    canvas.width,
    canvas.height,
  );

  // SHAKE
  let shaking = false;

  if (shakeTime > 0) {
    shaking = true;

    shakeTime--;

    ctx.save();

    ctx.translate(
      (Math.random() - 0.5) * shakePower,

      (Math.random() - 0.5) * shakePower,
    );
  }

  // DRAW
  drawBackground();

  drawClouds();

  drawGround();

  updatePlayer();

  drawPlayer();

  updateObstacle();

  drawObstacle();

  updateBoss();

  drawBoss();

  // =========================
  // BOSS INTRO EFFECT
  // =========================
  if (bossIntro) {
    introTimer--;

    // RED FLASH
    ctx.fillStyle = "rgba(255,0,0,0.15)";

    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // END INTRO
    if (introTimer <= 0) {
      bossIntro = false;
    }
  }

  // UPDATE PARTICLES
  updateParticles();

  checkCollision();

  // RESET SHAKE
  if (shaking) {
    ctx.restore();
  }

  // LOOP
  requestAnimationFrame(update);
}

// =========================
// START LOOP
// =========================
update();
