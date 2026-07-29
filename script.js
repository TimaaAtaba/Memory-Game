const gameBoard = document.getElementById("gameBoard");
const startBtn = document.getElementById("startBtn");
const message = document.getElementById("message");
const twoPlayersCheckbox = document.getElementById("twoPlayers");
const scoreBoard = document.getElementById("scoreBoard");
const player1Score = document.getElementById("player1Score");
const player2Score = document.getElementById("player2Score");
const currentPlayerDisplay = document.getElementById("currentPlayer");

const rows = 4;
const cols = 6;
let totalCards = rows * cols;
let symbols = [];
let flippedCards = [];
let lockBoard = false;
let matchedCount = 0;

let isTwoPlayers = false;
let currentPlayer = 1;
let scores = { 1: 0, 2: 0 };

startBtn.addEventListener("click", startGame);

function startGame() {
  isTwoPlayers = twoPlayersCheckbox.checked;
  currentPlayer = 1;
  scores = { 1: 0, 2: 0 };
  flippedCards = [];
  matchedCount = 0;
  message.textContent = "";
  scoreBoard.classList.toggle("hidden", !isTwoPlayers);
  updateScores();
  createSymbols();
  shuffle(symbols);
  renderBoard();
}

function createSymbols() {
  const base = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  symbols = [];
  for (let i = 0; i < totalCards / 2; i++) {
    let char = base[i % base.length];
    symbols.push(char, char);
  }
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function renderBoard() {
  gameBoard.innerHTML = "";
  symbols.forEach((symbol, index) => {
    const card = document.createElement("div");
    card.className = "card";
    card.dataset.symbol = symbol;
    card.dataset.index = index;
    card.addEventListener("click", handleCardClick);
    gameBoard.appendChild(card);
  });
}

function handleCardClick(e) {
  if (lockBoard) return;
  const card = e.currentTarget;
  if (card.classList.contains("flipped")) return;

  flipCard(card);
  flippedCards.push(card);

  if (flippedCards.length === 2) {
    lockBoard = true;
    const [card1, card2] = flippedCards;
    const isMatch = card1.dataset.symbol === card2.dataset.symbol;

    if (isMatch) {
      matchedCount += 2;
      if (isTwoPlayers) {
        scores[currentPlayer]++;
        updateScores();
      }
      flippedCards = [];
      lockBoard = false;

      if (matchedCount === totalCards) {
        showWinMessage();
      }

    } else {
      setTimeout(() => {
        unflipCard(card1);
        unflipCard(card2);
        flippedCards = [];
        lockBoard = false;
        if (isTwoPlayers) {
          switchPlayer();
        }
      }, 1000);
    }
  }
}

function flipCard(card) {
  card.classList.add("flipped");
  card.textContent = card.dataset.symbol;
}

function unflipCard(card) {
  card.classList.remove("flipped");
  card.textContent = "";
}

function switchPlayer() {
  currentPlayer = currentPlayer === 1 ? 2 : 1;
  updateScores();
}

function updateScores() {
  player1Score.textContent = `שחקן 1: ${scores[1]}`;
  player2Score.textContent = `שחקן 2: ${scores[2]}`;
  currentPlayerDisplay.textContent = `שחקן ${currentPlayer} בתורו`;
}

function showWinMessage() {
  if (isTwoPlayers) {
    if (scores[1] > scores[2]) {
      message.textContent = "שחקן 1 ניצח!";
    } else if (scores[2] > scores[1]) {
      message.textContent = "שחקן 2 ניצח!";
    } else {
      message.textContent = "תיקו!";
    }
  } else {
    message.textContent = "ניצחת!";
  }
}
