document.addEventListener("DOMContentLoaded", () => {
  const bird = document.querySelector(".bird");
  const gameDisplay = document.querySelector(".game-container");
  const sky = document.querySelector(".sky");
  const groundContainer = document.querySelector(".ground-container");
  const timer = document.querySelector(".timer-text");
  const score = document.querySelector(".score-text");

  const backgroundArray = ["Beach", "Capital", "Krakow", "Lake", "Mountain"];

  let birdBottom = 250;
  let birdLeft = 100;
  let isGameOver = false;
  let gap = 250;
  const gravity = 2;
  let time = 60;
  let scoreCount = 0;

  timer.innerHTML = time;
  score.innerHTML = scoreCount;

  const startGame = () => {
    birdBottom -= gravity;
    bird.style.left = birdLeft + "px";
    bird.style.bottom = birdBottom + "px";
  };

  let gameTimerId = setInterval(startGame, 20);

  const jump = () => {
    if (birdBottom < 500) {
      birdBottom += 50;
    }
  };

  const control = (e) => {
    if (e.keyCode === 32) {
      jump();
    }
  };

  const generateObstacle = () => {
    let obstacleLeft = 400;
    let randomHeight = 62 + Math.random() * 100;
    let obstacleBottom = randomHeight;
    const obstacle = document.createElement("div");
    const topObstacle = document.createElement("div");
    if (!isGameOver) {
      obstacle.classList.add("obstacle");
      topObstacle.classList.add("topObstacle");
    }

    gameDisplay.appendChild(obstacle);
    gameDisplay.appendChild(topObstacle);
    obstacle.style.left = obstacleLeft + "px";
    topObstacle.style.left = obstacleLeft + "px";
    obstacle.style.bottom = obstacleBottom + "px";
    topObstacle.style.bottom = obstacleBottom + gap + "px";

    const moveObstacle = () => {
      obstacleLeft -= 2;

      obstacle.style.left = obstacleLeft + "px";
      topObstacle.style.left = obstacleLeft + "px";

      if (obstacleLeft === -10) {
        clearInterval(timerId);
        gameDisplay.removeChild(obstacle);
        gameDisplay.removeChild(topObstacle);
        scoreCount += 10;
        score.innerHTML = scoreCount;
      }

      if (birdBottom === 60 || birdBottom === 470) {
        clearInterval(timerId);
        gameOver();
      }
    };
    let timerId = setInterval(moveObstacle, 20);
    if (!isGameOver) {
      setTimeout(generateObstacle, 3000);
    }
  };

  generateObstacle();

  const ChangeBackground = () => {
    let randomBackground = Math.floor(Math.random() * 4);
    console.log(randomBackground);
    sky.style.backgroundImage = `url('../assets/backgrounds/${backgroundArray[randomBackground]}Static.png')`;
    groundContainer.style.backgroundImage = `url('../assets/backgrounds/${backgroundArray[randomBackground]}Ground.png')`;
  };

  let backgroundChange = setInterval(() => {
    if (!isGameOver) {
      ChangeBackground();
    }
  }, 20000);

  const gameOver = () => {
    clearInterval(gameTimerId);
    clearInterval(backgroundChange);
    isGameOver = true;
    document.removeEventListener("keyup", control);

    window.location.replace(`/details/get-details?score=${scoreCount}`);
  };

  document.addEventListener("keyup", control);

  const startTimer = () => {
    let timerCounter = setInterval(() => {
      if (time === 0) {
        gameOver();
        isGameOver = true;
        clearInterval(timerCounter);
      }
      if (!isGameOver) {
        time -= 1;
        timer.innerHTML = time;
      }
    }, 1000);
  };
  startTimer();
});

let pgNo = 1;
const imageContainer = document.querySelector(".how-play-image");
function leftPage() {
  if (pgNo > 1) {
    pgNo -= 1;
    imageContainer.style.backgroundImage = `url('/assets/howtoplay${pgNo}.png')`;
  }
}

function rightPage() {
  if (pgNo < 3) {
    pgNo += 1;
    imageContainer.style.backgroundImage = `url('/assets/howtoplay${pgNo}.png')`;
  }
}
