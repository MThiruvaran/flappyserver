document.addEventListener("DOMContentLoaded", () => {
  const bird = document.querySelector(".bird");
  const gameDisplay = document.querySelector(".game-container");
  const sky = document.querySelector(".sky");
  const groundContainer = document.querySelector(".ground-container");
  const timer = document.querySelector(".timer-text");
  const score = document.querySelector(".score-text");

  gameDisplay.addEventListener("click", function (e) {
    if (!isGameOver) {
      if (jumpCond === false) {
        if (birdBottom < 470) jump();
      }
    }
  });
  let speed = 2;
  let projectileSpeed = 3;
  let normalSpeed = 2;
  let changed = false;
  let elementContainer = [];
  const backgroundArray = ["Beach", "Capital", "Krakow", "Lake", "Mountain"];
  const obstacles = [
    "Dragon.gif",
    "Eagle.gif",
    "FootballPlayer.gif",
    "PolishFlag.png",
    "Shamrock.png",
    "Siren.gif",
  ];

  const isOverlapping = (e1, secondDiv) => {
    e2 = secondDiv.mdiv;
    if (e1.length && e1.length > 1) {
      e1 = e1[0];
    }
    if (e2.length && e2.length > 1) {
      e2 = e2[0];
    }
    const rect1 = e1 instanceof Element ? e1.getBoundingClientRect() : false;
    const rect2 = e2 instanceof Element ? e2.getBoundingClientRect() : false;

    let overlap = false;

    if (rect1 && rect2) {
      overlap = !(
        rect1.right < rect2.left ||
        rect1.left > rect2.right ||
        rect1.bottom < rect2.top ||
        rect1.top > rect2.bottom
      );

      return { number: secondDiv.number, overlapState: overlap };
    }

    console.warn("Please provide valid HTMLElement object");
    return { number: 25, overlapState: overlap };
  };
  const timerJump = (ms) => new Promise((res) => setTimeout(res, 0.001));
  let currentlyColliding = false;
  let jumpCond = false;
  let birdBottom = 250;
  let birdLeft = 100;
  let isGameOver = false;

  let gravity = 2;
  let time = 60;
  let scoreCount = 0;

  timer.innerHTML = time;
  score.innerHTML = scoreCount;

  const startGame = () => {
    birdBottom -= gravity;
    bird.style.left = birdLeft + "px";
    bird.style.bottom = birdBottom + "px";
    gravity += 0.3;
  };

  let gameTimerId = setInterval(startGame, 20);

  const jump = () => {
    jumpCond = true;
    nexPosY = birdBottom + 75;
    load();
    gravity = 2;
    jumpCond = false;
  };
  async function load() {
    // We need to wrap the loop into an async function for this to work
    bird.style.backgroundImage = "url('/assets/LeprechaunJumpGIF.gif')";
    while (birdBottom < nexPosY) {
      gravity = 0;
      birdBottom += 2;
      await timerJump(3); // then the created Promise can be awaited
    }
    bird.style.backgroundImage = "url('/assets/LeprechaunFallGIF.gif')";
  }

  const control = (e) => {
    if (e.keyCode === 32) {
      jump();
    }
  };

  const generateObstacle = () => {
    let obstacleLeft = 400;
    let projectileLeft = 400;
    let randomHeight = 62 + Math.random() * 380;
    let obstacleBottom = randomHeight;
    let projectileBottom = randomHeight;

    const obstacle = document.createElement("div");
    const projectile = document.createElement("div");

    if (!isGameOver) {
      obstacle.classList.add("obstacle");
    }
    if (!isGameOver) {
      projectile.classList.add("obstacle");
    }

    let obstacleNumber = Math.floor(Math.random() * 6);

    gameDisplay.appendChild(obstacle);
    gameDisplay.appendChild(projectile);
    obstacleNames = obstacles[obstacleNumber];
    obstacle.style.backgroundImage = `url('/assets/obstacle/${obstacles[obstacleNumber]}')`;

    obstacle.style.left = obstacleLeft + "px";
    projectile.style.left = projectileLeft + "px";
    obstacle.style.bottom = obstacleBottom + "px";
    projectile.style.bottom = projectileBottom - 30 + "px";
    elementContainer.push({ number: obstacleNumber, mdiv: obstacle });

    if (obstacleNumber === 0) {
      projectile.style.backgroundImage = `url('/assets/obstacle/Fireball.gif')`;
      projectile.style.visibility = "hidden";
      elementContainer.push({ number: 11, mdiv: projectile });
    } else if (obstacleNumber === 2) {
      projectile.style.backgroundImage = `url('/assets/obstacle/Ball.png')`;
      projectile.style.visibility = "hidden";
      elementContainer.push({ number: 111, mdiv: projectile });
    }
    const moveProjectile = () => {
      if (projectileLeft < 300) {
        speed = projectileSpeed;
        projectile.style.visibility = "visible";
      }

      projectileLeft -= speed;
      projectile.style.left = projectileLeft + "px";

      if (projectileLeft === -10) {
        clearInterval(projectiletimerId);
        gameDisplay.removeChild(projectile);
        score.innerHTML = scoreCount;
      }

      if (birdBottom <= 60 || birdBottom === 470) {
        clearInterval(projectiletimerId);
        gameOver();
      }
    };
    let projectiletimerId = setInterval(moveProjectile, 20);

    const moveObstacle = () => {
      obstacleLeft -= normalSpeed;
      obstacle.style.left = obstacleLeft + "px";

      if (obstacleLeft === -10) {
        clearInterval(timerId);
        gameDisplay.removeChild(obstacle);
        score.innerHTML = scoreCount;
      }

      if (birdBottom <= 60 || birdBottom === 470) {
        clearInterval(timerId);
        gameOver();
      }
    };
    let timerId = setInterval(moveObstacle, 20);
    if (!isGameOver) {
      setTimeout(generateObstacle, 1000);
    }

    elementContainer.forEach((element) => {
      num = isOverlapping(bird, element);
      if (num.overlapState) {
        switch (num.number) {
          case 0:
            currentlyColliding = true;
            console.log("Dragon");
            gameOver();
            break;
          case 1:
            currentlyColliding = true;
            element.mdiv.style.backgroundImage =
              "url('/assets/obstacle/EaglePickup.gif')";
            console.log("Eagle");
            time += 7;
            break;
          case 11:
            currentlyColliding = true;
            element.mdiv.style.backgroundImage = "url('/assets/obstacle/')";
            console.log("Foot");
            scoreCount += 25;
            break;
          case 3:
            currentlyColliding = true;
            element.mdiv.style.backgroundImage =
              "url('/assets/obstacle/FlagPickup.gif')";
            console.log("Flag");
            scoreCount += 25;
            break;
          case 4:
            scoreCount += 75;
            currentlyColliding = true;
            element.mdiv.style.backgroundImage =
              "url('/assets/obstacle/CloverPickup.gif')";
            console.log("Clover");
            break;
          case 5:
            urrentlyColliding = true;
            time += 7;
            element.mdiv.style.backgroundImage =
              "url('/assets/obstacle/SirenPickup.gif')";
            console.log("Siren");
            time += 7;
            break;
          case 11:
            currentlyColliding = true;
            gameOver();
            break;
          case 111:
            break;
        }
      }
    });
  };

  generateObstacle();

  const gameOver = () => {
    clearInterval(gameTimerId);

    bird.style.backgroundImage = "url('/assets/LeprechaunDead.png')";

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
