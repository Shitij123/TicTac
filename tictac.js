let boxes = document.querySelectorAll(".box");
let resetBtn = document.querySelector("#reset-btn");
let newGameBtn = document.querySelector("#new-btn");
let msgContainer = document.querySelector(".msg-container");
let msg = document.querySelector("#msg");
let turnO = true; // PlayerO starts first
let count = 0; // To track draw
const winPatterns = [
  [0, 1, 2],
  [0, 3, 6],
  [0, 4, 8],
  [1, 4, 7],
  [2, 5, 8],
  [2, 4, 6],
  [3, 4, 5],
  [6, 7, 8],
];
const resetGame = () => {
  turnO = true;
  count = 0;
  enableBoxes();
  msgContainer.classList.add("hide");
};
const gameDraw = () => {
  msg.innerText = `Game was a Draw.`;
  msgContainer.classList.remove("hide");
  disableBoxes();
};
const disableBoxes = () => {
  for (let box of boxes) {
    box.disabled = true;
  }
};
const enableBoxes = () => {
  for (let box of boxes) {
    box.disabled = false;
    box.innerText = "";
  }
};
const showWinner = (winner) => {
  msg.innerText = `Congratulations, Winner is ${winner}`;
  msgContainer.classList.remove("hide");
  disableBoxes();
};
const checkWinner = () => {
  for (let pattern of winPatterns) {
    let pos1Val = boxes[pattern[0]].innerText;
    let pos2Val = boxes[pattern[1]].innerText;
    let pos3Val = boxes[pattern[2]].innerText;
    if (pos1Val !== "" && pos1Val === pos2Val && pos2Val === pos3Val) {
      showWinner(pos1Val);
      return true;
    }
  }
  return false;
};
const bestMove = () => {
  let bestScore = -Infinity;
  let move;
  for (let i = 0; i < boxes.length; i++) {
    if (boxes[i].innerText === "") {
      boxes[i].innerText = "X";
      count++;
      let score = minimax(false);
      count--;
      boxes[i].innerText = "";
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }
  if (move !== undefined) {
    boxes[move].innerText = "X";
    boxes[move].disabled = true;
    count++;
    if (checkWinner()) return;
    if (count === 9) gameDraw();
  }
};
const minimax = (isMaximizing) => {
  if (checkWinnerAI("X")) return 1;
  if (checkWinnerAI("O")) return -1;
  if (count >= 9)return 0;
  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < boxes.length; i++) {
      if (boxes[i].innerText === "") {
        boxes[i].innerText = "X";
        count++;
        let score = minimax(false);
        count--;
        boxes[i].innerText = "";
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < boxes.length; i++) {
      if (boxes[i].innerText === "") {
        boxes[i].innerText = "O";
        count++;
        let score = minimax(true);
        count--;
        boxes[i].innerText = "";
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
};
const checkWinnerAI = (player) => {
  return winPatterns.some((pattern) => {
    return (
      boxes[pattern[0]].innerText === player &&
      boxes[pattern[1]].innerText === player &&
      boxes[pattern[2]].innerText === player
    );
  });
};
boxes.forEach((box) => {
  box.addEventListener("click", () => {
    if (turnO && box.innerText === "") {
      box.innerText = "O";
      box.disabled = true;
      count++;
      let isWinner = checkWinner();
      if (!isWinner && count < 9) {
        turnO = false;
        setTimeout(() => {
          bestMove();
          turnO = true;
        }, 500);
      }
    }
  });
});
newGameBtn.addEventListener("click", resetGame);
resetBtn.addEventListener("click", resetGame);
