//imports the two games that will be randomly selected for the user to play
const runColorGame = require('./colorGame');
const runEmojiGame = require('./emojiGame');

const games = [runColorGame, runEmojiGame];

process.stdin.setRawMode(true);
process.stdin.resume();
process.stdin.setEncoding('utf8');

let score = 0;
let timeLeft = 60;
let timer = null;

// Displays the splash screen and waits for the user to start the game.
function showSplash(onDone) {
  console.clear();

  console.log(`
\x1b[32m
  ███████╗██╗     ██╗ ██████╗███████╗███████╗
  ██╔════╝██║     ██║██╔════╝██╔════╝██╔════╝
  ███████╗██║     ██║██║     █████╗  ███████╗
  ╚════██║██║     ██║██║     ██╔══╝  ╚════██║
  ███████║███████╗██║╚██████╗███████╗███████║
  ╚══════╝╚══════╝╚═╝ ╚═════╝╚══════╝╚══════╝
\x1b[0m

            SLICES TERMINAL
            
Score as many points as you can in 60 seconds!

`);

  console.log("\nPress any key to start...");

  const startHandler = () => {
    process.stdin.removeListener('data', startHandler);
    onDone();
  };

  process.stdin.on('data', startHandler);
}

function gameOver() {
  clearInterval(timer);

  // kill ALL input listeners so nothing else prints after this
  process.stdin.removeAllListeners('data');

  console.clear();
  console.log("GAME OVER");
  console.log("Final Score:", score);

  process.exit();
}

// Starts the countdown timer and ends the game when time runs out.
function startTimer() {
  timer = setInterval(() => {
    timeLeft--;

    if (timeLeft <= 0) {
      gameOver();
    }
  }, 1000);
}

// ---- GAME CONTROLLER ----

function startGame() {
  startTimer();
  nextRound();
}

function nextRound() {
  if (timeLeft <= 0) return;

  process.stdin.removeAllListeners('data');
  // Randomly selects a game and starts it, passing in the time left and a callback for when the game is complete.
  const game = games[Math.floor(Math.random() * games.length)];

  game({
    timeLeft,
    onComplete: (result) => {
      if (timeLeft <= 0) return;

      score += result?.score || 1;

      nextRound();
    }
  });
}

// entry point
showSplash(startGame);