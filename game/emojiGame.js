function runEmojiGame({ onComplete }) {
  const rows = 3;
  const cols = 3;
  const total = rows * cols;

  const FACES = [
    { face: "ಠ_ಠ", color: 31 },
    { face: "(ᵔᴥᵔ)", color: 33 },
    { face: "◉_◉", color: 34 },
    { face: "♥‿♥", color: 31 },
    { face: "\\ (•◡•) /", color: 33 },
    { face: "(¬_¬)", color: 32 }
  ];

  let grid = [];
  let oddIndex = null;
  let canTap = false;
  let startTime = Date.now();

  function pad(str, width = 12) {
    return str.padEnd(width, " ");
  }

  function colorize(text, color) {
    return `\x1b[${color}m${text}\x1b[0m`;
  }

  function generateGrid() {
    const normal = Math.floor(Math.random() * FACES.length);

    let diff;
    do {
      diff = Math.floor(Math.random() * FACES.length);
    } while (diff === normal);

    grid = Array(total).fill(normal);
    oddIndex = Math.floor(Math.random() * total);
    grid[oddIndex] = diff;

    canTap = false;
    startTime = Date.now();

    render();

    setTimeout(() => {
      canTap = true;
    }, 500);
  }

  function render() {
    console.clear();

    console.log("=== FIND THE DIFFERENT FACE ===\n");

    for (let r = 0; r < rows; r++) {
      let line = "";

      for (let c = 0; c < cols; c++) {
        const i = r * cols + c;
        const f = FACES[grid[i]];

        const display = colorize(pad(f.face), f.color);
        line += `[${i + 1}] ${display} `;
      }

      console.log(line);
      console.log("");
    }

    console.log("Type 1–9");
    console.log("Press Q to quit");
  }

  function cleanup() {
    process.stdin.removeListener('data', handleInput);
  }

  function handleInput(key) {
    if (key === 'q') process.exit();
    if (!canTap) return;

    const num = parseInt(key);
    if (!num || num < 1 || num > total) return;

    const index = num - 1;

    if (index === oddIndex) {
      const elapsed = (Date.now() - startTime) / 1000;

      console.log("\nCorrect!");

      cleanup();

      setTimeout(() => {
        onComplete?.({ score: 1, elapsed });
      }, 300);
    } else {
      console.log("\nWrong!");
    }
  }

  generateGrid();
  process.stdin.on('data', handleInput);
}

module.exports = runEmojiGame;