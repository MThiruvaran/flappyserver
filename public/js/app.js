let audioMuted = false;
const audioButton = document.getElementsByClassName("audioButton");
audioButton.src = "./assets/volume.png";
const sound = document.createElement("audio");

const muteControl = () => {
  console.log(audioButton);
  audioMuted = !audioMuted;
  console.log(audioMuted);
  if (audioMuted) {
    sound.muted = true;
    audioButton.src = "./assets/mute.png";
  } else {
    sound.muted = false;
    audioButton.src = "./assets/volume.png";
  }
};

document.addEventListener("DOMContentLoaded", () => {
  const startQuest = () => {
    const bird = document.querySelector(".bird");
    const gameDisplay = document.querySelector(".game-container");
    const sky = document.querySelector(".sky");
    const groundContainer = document.querySelector(".ground-container");
    const timer = document.querySelector(".timer-text");
    const score = document.querySelector(".score-text");

    let visibileNow = false;
    let currentlyNotColliding = true;
    let speed = 2;
    let projectileSpeed = 3;
    let normalSpeed = 2;
    let elementContainer = [];
    // const backgroundArray = ["Beach", "Capital", "Krakow", "Lake", "Mountain"];
    const obstacles = [
      "Dragon.gif",
      "FootballPlayer.gif",
      "PolishFlag.png",
      "Shamrock.png",
      "PolishFlag.png",
      "Shamrock.png",
    ];

    const timedObstacles = ["Siren.gif", "Eagle.gif"];

    const timerJump = (ms) => new Promise((res) => setTimeout(res, 0.001));

    let ballAngle;
    let jumpCond = false;
    let birdBottom = 250;
    let birdLeft = 100;
    let isGameOver = false;
    let popupBottom = 0;
    let popupLeft = 0;

    let caught = false;

    let gravity = 0;
    let time = 60;
    let scoreCount = 0;

    timer.innerHTML = time;
    score.innerHTML = scoreCount;

    sound.src = "/assets/Sounds/PolishAnthem.mp3";
    sound.setAttribute("preload", "auto");
    sound.setAttribute("controls", "none");
    sound.style.display = "none";
    document.body.appendChild(sound);
    sound.volume = 0.1;
    sound.play();

    const jumpSound = document.createElement("audio");
    jumpSound.src = "/assets/Sounds/Jump.wav";
    jumpSound.setAttribute("preload", "auto");
    jumpSound.setAttribute("controls", "none");
    jumpSound.style.display = "none";
    document.body.appendChild(jumpSound);
    jumpSound.loop = false;

    const collectSoundTime = document.createElement("audio");
    collectSoundTime.src = "/assets/Sounds/Get_Item2.wav";
    collectSoundTime.setAttribute("preload", "auto");
    collectSoundTime.setAttribute("controls", "none");
    collectSoundTime.style.display = "none";
    document.body.appendChild(collectSoundTime);
    collectSoundTime.loop = false;

    const FireballShoot = document.createElement("audio");
    FireballShoot.src = "/assets/Sounds/Get_Item2.wav";
    FireballShoot.setAttribute("preload", "auto");
    FireballShoot.setAttribute("controls", "none");
    FireballShoot.style.display = "none";
    document.body.appendChild(collectSoundTime);
    FireballShoot.loop = false;

    const BallPickup = document.createElement("audio");
    BallPickup.src = "/assets/Sounds/BallPickup.wav";
    BallPickup.setAttribute("preload", "auto");
    BallPickup.setAttribute("controls", "none");
    BallPickup.style.display = "none";
    document.body.appendChild(BallPickup);
    BallPickup.loop = false;

    const SirenPickup = document.createElement("audio");
    SirenPickup.src = "/assets/Sounds/SirenPickup.wav";
    SirenPickup.setAttribute("preload", "auto");
    SirenPickup.setAttribute("controls", "none");
    SirenPickup.style.display = "none";
    document.body.appendChild(SirenPickup);
    SirenPickup.loop = false;

    const CloverPickup = document.createElement("audio");
    CloverPickup.src = "/assets/Sounds/CloverPickup.wav";
    CloverPickup.setAttribute("preload", "auto");
    CloverPickup.setAttribute("controls", "none");
    CloverPickup.style.display = "none";
    document.body.appendChild(CloverPickup);
    CloverPickup.loop = false;

    const FlagPickup = document.createElement("audio");
    FlagPickup.src = "/assets/Sounds/FlagPickup.wav";
    FlagPickup.setAttribute("preload", "auto");
    FlagPickup.setAttribute("controls", "none");
    FlagPickup.style.display = "none";
    document.body.appendChild(FlagPickup);
    FlagPickup.loop = false;

    const gameOverSound = document.createElement("audio");
    gameOverSound.src = "/assets/Sounds/Explode2.wav";
    gameOverSound.setAttribute("preload", "auto");
    gameOverSound.setAttribute("controls", "none");
    gameOverSound.style.display = "none";
    document.body.appendChild(gameOverSound);
    gameOverSound.loop = false;

    gameDisplay.addEventListener("click", function (e) {
      if (!isGameOver) {
        if (jumpCond === false) {
          if (birdBottom < 470) jump();
          if (!audioMuted) {
            jumpSound.play();
          }
          hasStarted = true;
        }
      }
    });

    function arrayRemove(arr, value) {
      return arr.filter(function (ele) {
        return ele != value;
      });
    }
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

    const startGame = () => {
      birdBottom -= gravity;
      bird.style.left = birdLeft + "px";
      bird.style.bottom = birdBottom + "px";
      gravity += 0.23;

      timer.innerHTML = time;
      score.innerHTML = scoreCount;

      elementContainer.forEach((element) => {
        num = isOverlapping(bird, element);

        if (num.overlapState) {
          if (currentlyNotColliding) {
            const popup = document.createElement("div");

            switch (num.number) {
              case 0:
                currentlyNotColliding = false;
                gameOver();
                break;
              case 100:
                currentlyNotColliding = false;
                element.mdiv.style.opacity = 0; // "url('./obstacle/')";
                time += 7;
                collectSoundTime.play();
                popup.classList.add("dragon");
                gameDisplay.appendChild(popup);
                popup.style.backgroundImage =
                  "url('/assets/obstacle/EaglePickup.gif')";
                popup.style.bottom = element.mdiv.style.bottom;
                popup.style.left = element.mdiv.style.left;

                elementRemoval(popup);

                elementContainer = arrayRemove(elementContainer, element);
                break;
              case 111:
                currentlyNotColliding = false;
                caught = true;
                bird.style.backgroundImage =
                  "url('/assets/LeperchaunCatch.gif')";
                element.mdiv.style.opacity = 0; //"url('./obstacle/')";
                popup.classList.add("dragon");
                gameDisplay.appendChild(popup);
                popup.style.backgroundImage =
                  "url('/assets/obstacle/BallPickUp.gif')";
                popup.style.bottom = element.mdiv.style.bottom;
                popup.style.left = element.mdiv.style.left;

                stateChange();
                elementRemoval(popup);

                scoreCount += 125;
                if (!audioMuted) {
                  BallPickup.play();
                }

                elementContainer = arrayRemove(elementContainer, element);
                break;
              case 2:
              case 4:
                currentlyNotColliding = false;
                element.mdiv.style.opacity = 0; //"url('./obstacle/')";
                scoreCount += 25;
                if (!audioMuted) {
                  FlagPickup.play();
                }

                popup.classList.add("dragon");
                gameDisplay.appendChild(popup);
                popup.style.backgroundImage =
                  "url('/assets/obstacle/FlagPickup.gif')";
                popup.style.bottom = element.mdiv.style.bottom;
                popup.style.left = element.mdiv.style.left;

                elementRemoval(popup);

                elementContainer = arrayRemove(elementContainer, element);
                break;
              case 3:
              case 5:
                scoreCount += 75;
                currentlyNotColliding = false;
                element.mdiv.style.opacity = 0; //"url('./obstacle/')";

                if (!audioMuted) {
                  CloverPickup.play();
                }

                popup.classList.add("dragon");
                gameDisplay.appendChild(popup);
                popup.style.backgroundImage =
                  "url('/assets/obstacle/CloverPickup.gif')";
                popup.style.bottom = element.mdiv.style.bottom;
                popup.style.left = element.mdiv.style.left;

                elementRemoval(popup);

                elementContainer = arrayRemove(elementContainer, element);
                break;
              case 99:
                currentlyNotColliding = false;
                time += 7;
                element.mdiv.style.opacity = 0; //"url('./obstacle/')";
                time += 7;
                if (!audioMuted) {
                  SirenPickup.play();
                }

                popup.classList.add("dragon");
                gameDisplay.appendChild(popup);
                popup.style.backgroundImage =
                  "url('/assets/obstacle/SirenPickup.gif')";
                popup.style.bottom = element.mdiv.style.bottom;
                popup.style.left = element.mdiv.style.left;

                elementRemoval(popup);

                elementContainer = arrayRemove(elementContainer, element);
                break;
              case 11:
                currentlyColliding = false;
                gameOver();
                break;
            }
          } else {
            currentlyNotColliding = true;
          }
        }
      });
    };

    function stateChange() {
      setTimeout(function () {
        bird.style.backgroundImage = "url('/assets/LeprechaunFallGIF.png')";
        caught = false;
      }, 1000);
    }

    function elementRemoval(removeElt) {
      setTimeout(function () {
        gameDisplay.removeChild(removeElt);
      }, 1000);
    }

    let gameTimerId = setInterval(startGame, 20);
    startGame.setTimeout;

    const jump = () => {
      jumpCond = true;
      nexPosY = birdBottom + 75;
      load();
      gravity = 2;
      jumpCond = false;
    };
    async function load() {
      // We need to wrap the loop into an async function for this to work
      bird.style.backgroundImage = "url('/assets/LeprechaunJumpGIF.png')";
      while (birdBottom < nexPosY) {
        gravity = 0;
        birdBottom += 2;
        await timerJump(3); // then the created Promise can be awaited
      }
      if (!caught) {
        bird.style.backgroundImage = "url('/assets/LeprechaunFallGIF.png')";
      }
    }

    const control = (e) => {
      if (e.keyCode === 32) {
        jump();
      }
    };

    const generateObstacle = () => {
      let obstacleLeft = 400;
      let projectileLeftFire = 400;
      let projectileLeftBall = 400;
      let randomHeight = 62 + Math.random() * 380;
      let obstacleBottom = randomHeight;
      let projectileBottomFire = randomHeight;
      let projectileBottomBall = 50;
      let obstacleNumber = Math.floor(Math.random() * 6);

      const obstacle = document.createElement("div");
      const projectileFire = document.createElement("div");
      const projectileBall = document.createElement("div");

      if (!isGameOver) {
        if (obstacleNumber === 0) {
          obstacle.classList.add("dragon");
        } else {
          obstacle.classList.add("obstacle");
        }
        projectileFire.classList.add("projectiles");
        projectileBall.classList.add("projectiles");
      }

      gameDisplay.appendChild(obstacle);
      gameDisplay.appendChild(projectileFire);
      gameDisplay.appendChild(projectileBall);
      obstacleNames = obstacles[obstacleNumber];
      obstacle.style.backgroundImage = `url('/assets/obstacle/${obstacles[obstacleNumber]}')`;

      obstacle.style.left = obstacleLeft + "px";
      projectileFire.style.left = projectileLeftFire + "px";
      projectileBall.style.left = projectileLeftBall + "px";
      obstacle.style.bottom = obstacleBottom + "px";

      elementContainer.push({ number: obstacleNumber, mdiv: obstacle });

      if (obstacleNumber === 0) {
        projectileFire.style.bottom = projectileBottomFire + "px";
        projectileFire.style.backgroundImage = `url('/assets/obstacle/Fireball.gif')`;
        projectileFire.style.visibility = "hidden";
        elementContainer.push({ number: 11, mdiv: projectileFire });
      } else if (obstacleNumber === 1) {
        obstacle.style.bottom = 30 + "px";
        projectileBall.style.bottom = 15 + "px";
        projectileBall.style.backgroundImage = `url('/assets/obstacle/Ball.png')`;
        projectileBall.style.visibility = "hidden";
        elementContainer.push({ number: 111, mdiv: projectileBall });
      }
      const moveProjectileFire = () => {
        if (projectileLeftFire < 300) {
          speed = projectileSpeed;
          projectileFire.style.visibility = "visible";
        }

        projectileLeftFire -= speed;
        projectileFire.style.left = projectileLeftFire + "px";

        if (projectileLeftFire === -10) {
          clearInterval(projectiletimerIdFire);
          gameDisplay.removeChild(projectileFire);
        }

        if (birdBottom <= 60 || birdBottom === 470) {
          clearInterval(projectiletimerIdFire);
        }
      };

      const moveProjectileBall = () => {
        if (projectileLeftBall <= 300) {
          speed = projectileSpeed;
          projectileBall.style.visibility = "visible";
          visibileNow = true;
        } else {
          visibileNow = false;
        }

        if (visibileNow) {
          ballAngle = Math.floor(Math.random() * (5 - 1.5 + 1)) + 1.5;
        } else {
          ballAngle = 0;
        }

        projectileLeftBall -= speed;
        projectileBottomBall += ballAngle;
        projectileBall.style.left = projectileLeftBall + "px";
        console.log(projectileLeftBall);

        projectileBall.style.bottom = projectileBottomBall + "px";

        if (projectileLeftBall === -100) {
          console.log("--------------------------------");

          originalString = `url(\"/assets/obstacle/Ball.png\")`;
          comparisonString = projectileBall.style.backgroundImage.toString();
          if (comparisonString === originalString) {
            time -= 7;
            console.log("Reduced time");
          }

          clearInterval(projectiletimerIdBall);
          gameDisplay.removeChild(projectileBall);
        }

        if (birdBottom <= 60 || birdBottom === 470) {
          clearInterval(projectiletimerIdBall);
        }
      };
      let projectiletimerIdFire = setInterval(moveProjectileFire, 20);
      let projectiletimerIdBall = setInterval(moveProjectileBall, 20);

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
        setTimeout(generateObstacle, 2000);
      }
    };

    const generateTimedObstacle = () => {
      let obstacleLeft = 400;
      let randomHeight = 62 + Math.random() * 380;
      let obstacleBottom = randomHeight;

      let obstacleNumber = Math.floor(Math.random() * 2);
      let displacement = Math.floor(Math.random() * 10);
      const timedObstacle = document.createElement("div");

      if (!isGameOver) {
        timedObstacle.classList.add("obstacle");
      }

      gameDisplay.appendChild(timedObstacle);
      timedObstacle.style.backgroundImage = `url('/assets/obstacle/${timedObstacles[obstacleNumber]}')`;
      timedObstacle.style.left = obstacleLeft + displacement + "px";
      timedObstacle.style.bottom = obstacleBottom + "px";

      elementContainer.push({
        number: obstacleNumber + 99,
        mdiv: timedObstacle,
      });

      const moveTimedObstacle = () => {
        obstacleLeft -= normalSpeed;
        timedObstacle.style.left = obstacleLeft + "px";

        if (obstacleLeft === -10) {
          clearInterval(timerIdOther);
          gameDisplay.removeChild(timedObstacle);
          score.innerHTML = scoreCount;
        }
      };
      let timerIdOther = setInterval(moveTimedObstacle, 20);
      if (!isGameOver) {
        setTimeout(generateTimedObstacle, 10000);
      }
    };

    generateObstacle();
    generateTimedObstacle();

    // const ChangeBackground = () => {
    //   let randomBackground = Math.floor(Math.random() * 4);
    //   sky.style.backgroundImage = `url('/assets/backgrounds/${backgroundArray[randomBackground]}Static.png')`;
    // };

    // let backgroundChange = setInterval(() => {
    //   if (!isGameOver) {
    //     ChangeBackground();
    //   }
    // }, 20000);

    const gameOver = () => {
      clearInterval(gameTimerId);
      // clearInterval(backgroundChange);
      console.log("Game over");
      if (!audioMuted) {
        gameOverSound.play();
      }

      bird.style.backgroundImage = "url('/assets/LeprechaunDead.png')";

      isGameOver = true;
      document.removeEventListener("keyup", control);
      setTimeout(() => {
        window.location.replace(`/details/get-details?score=${scoreCount}`);
      }, 3000);
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
  };

  const clickInstruction = document.querySelector(".click-instruction");

  const getDeviceType = () => {
    const ua = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
      return "tablet";
    }
    if (
      /Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
        ua
      )
    ) {
      clickInstruction.innerHTML = "TAP ANYWHERE TO JUMP";
      return;
    }
    clickInstruction.innerHTML = "CLICK ANYWHERE TO JUMP";
    return;
  };

  getDeviceType();

  let startingTime = 3;

  const startingTimeText = document.querySelector(".startGameTimerText");
  const startingTimeDiv = document.querySelector(".startGameTimer");

  setTimeout(startQuest, 3000);
  let questStart = setInterval(() => {
    if (startingTime > 1) {
      startingTime -= 1;
      startingTimeText.innerHTML = startingTime;
    } else {
      startingTimeDiv.remove();
      clearInterval(questStart);
    }
  }, 1000);
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
