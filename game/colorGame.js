//defines colors and words available for users to choose from
const COLORS = ["Red", "Blue", "Green", "Magenta", "Yellow"];
const WORDS = ["RED", "BLUE", "GREEN", "MAGENTA", "YELLOW"];

// Colors the text for console output.
function colorText(text, color) {
  const map = {
    Red: "\x1b[31m",
    Blue: "\x1b[34m",
    Green: "\x1b[32m",
    Magenta: "\x1b[35m",
    Yellow: "\x1b[33m",
  };
  return (map[color] || "") + text + "\x1b[0m";
}

function runColorGame({ onComplete }) {
  let current = null;
  let modeWord = true;

  // Generates a new round and randomly decides whether the player should pick the color or the word.
  function generateRound() {
    const colorIdx = Math.floor(Math.random() * COLORS.length);
    let wordIdx = Math.floor(Math.random() * WORDS.length);

    if (Math.random() < 0.6) {
      while (wordIdx === colorIdx) {
        wordIdx = Math.floor(Math.random() * WORDS.length);
      }
    } else {
      wordIdx = colorIdx;
    }

    current = { colorIdx, wordIdx };
    modeWord = Math.random() < 0.5;
  }

  // Renders the game state to the console with instructions.
  function render() {
    console.clear();

    console.log("=== COLOR GAME ===\n");
    console.log(modeWord ? "Pick the WORD" : "Pick the COLOR");

    const word = WORDS[current.wordIdx];
    const color = COLORS[current.colorIdx];

    console.log(colorText(word, color));
    console.log("");

    WORDS.forEach((_, i) => {
      console.log(`${i + 1}. ${COLORS[i]}`);
    });

    console.log("\nType number (1-5), Q to quit");
  }

  function cleanup() {
    process.stdin.removeListener('data', handleInput);
  }

  function handleInput(key) {
    if (key === 'q') process.exit();

    const num = parseInt(key);

    // FIXED: only 1-5 valid
    if (!num || num < 1 || num > 5) return;

    const answer = WORDS[num - 1];

    const correctValue = modeWord
      ? WORDS[current.wordIdx]
      : WORDS[current.colorIdx];

    if (answer === correctValue) {
      console.log("\nCorrect!");

      cleanup();

      setTimeout(() => {
        onComplete?.({ score: 1 });
      }, 300);
    } else {
      console.log("\nWrong!");
    }
  }

  generateRound();
  render();

  process.stdin.on('data', handleInput);
}

module.exports = runColorGame;