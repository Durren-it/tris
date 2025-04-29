const board = document.getElementById('board');
const cells = document.querySelectorAll('.cell');
const resetButton = document.getElementById('resetButton');
const statusDisplay = document.getElementById('status');
const themeSelector = document.getElementById('theme');
const resetScoreButton = document.getElementById('resetScoreButton');
const logList = document.getElementById('logList');
const tooltip = document.getElementById('customTooltip');
let currentPlayer = 'X';
let playerSymbols = {
    X: 'X',
    O: 'O'
  };
let gameState = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;

// Gestione del tema
function applyTheme(theme) {
    document.body.className = '';
    switch (theme) {
        case 'dark':
            document.body.classList.add('dark-theme');
            break;
        case 'rosee':
            document.body.classList.add('rosee-theme');
            break;
        case 'violet':
            document.body.classList.add('violet-theme');
            break;
        default:
            document.body.classList.add('default-theme');
    }
    // Salva il tema selezionato
    localStorage.setItem('selectedTheme', theme);
    themeSelector.value = theme;
}
themeSelector.addEventListener('change', function () {
    applyTheme(this.value);
});

// Carica il tema salvato (o default)
const savedTheme = localStorage.getItem('selectedTheme') || 'default';
applyTheme(savedTheme);

// Gestore di scelta dei simboli
const symbolXInput = document.getElementById('symbolX');
const symbolOInput = document.getElementById('symbolO');
const applySymbolsButton = document.getElementById('applySymbols');

applySymbolsButton.addEventListener('click', () => {
  const newSymbolX = symbolXInput.value.trim() || 'X';
  const newSymbolO = symbolOInput.value.trim() || 'O';

  // Evita che i simboli siano identici
  if (newSymbolX === newSymbolO) {
    alert('I simboli dei due giocatori devono essere diversi.');
    return;
  }

  playerSymbols.X = newSymbolX;
  playerSymbols.O = newSymbolO;

  // Reimposta il gioco con i nuovi simboli
  handleReset();
});

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

// Funzione dei click
function handleCellClick(event) {
    const clickedCell = event.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

    if (gameState[clickedCellIndex] !== '' || !gameActive) {
        return;
    }

    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.textContent = playerSymbols[currentPlayer];
    addMoveToLog(currentPlayer, clickedCellIndex);

    checkResult();
    if (gameActive) {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        statusDisplay.textContent = `Turno di ${getPlayerName(currentPlayer)}`;
    }
}

// Gestion del tooltip
cells.forEach((cell, index) => {
    const row = Math.floor(index / 3) + 1;
    const col = (index % 3) + 1;
    const cellName = `Riga ${row}, Colonna ${col}`;

    cell.addEventListener('mouseover', (e) => {
        tooltip.textContent = cellName;
        tooltip.style.display = 'block';
        tooltip.style.left = e.pageX + 10 + 'px';
        tooltip.style.top = e.pageY + 10 + 'px';
    });

    cell.addEventListener('mousemove', (e) => {
        tooltip.style.left = e.pageX + 10 + 'px';
        tooltip.style.top = e.pageY + 10 + 'px';
    });

    cell.addEventListener('mouseout', () => {
        tooltip.style.display = 'none';
    });
});

// Funzione di log delle mosse
function addMoveToLog(player, index) {
    const row = Math.floor(index / 3) + 1;
    const col = (index % 3) + 1;
    const li = document.createElement('li');
    li.textContent = `${getPlayerName(player)} → Riga ${row}, Colonna ${col}`;
    li.dataset.index = index;

    li.addEventListener('mouseenter', () => {
        cells[index].classList.add('highlight');
    });

    li.addEventListener('mouseleave', () => {
        cells[index].classList.remove('highlight');
    });

    logList.appendChild(li);
}

// Gestione nome player
function getPlayerName(symbol) {
    return symbol === 'X' ? `Giocatore 1 - ${playerSymbols.X}` : `Giocatore 2 - ${playerSymbols.O}`;
  }

// Funzione di controllo stato gioco
function checkResult() {
    let roundWon = false;
    let winningCombo = [];

    for (let i = 0; i < winningConditions.length; i++) {
    const [a, b, c] = winningConditions[i];
        if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
            roundWon = true;
            winningCombo = [a, b, c];
            break;
    }
}

    if (roundWon) {
        winningCombo.forEach(index => {
            cells[index].classList.add('winning-cell');
        });

        statusDisplay.textContent = `${getPlayerName(currentPlayer)} ha vinto!`;
        wins[currentPlayer]++;
        localStorage.setItem(`wins${currentPlayer}`, wins[currentPlayer]);
        updateStatsDisplay();
        gameActive = false;
        return;
    }

    const roundDraw = !gameState.includes('');
    if (roundDraw) {
        statusDisplay.textContent = 'Pareggio!';
        gameActive = false;
        return;
    }

    //statusDisplay.textContent = `Turno del giocatore ${currentPlayer}`;
}

// Storage delle vittorie
let wins = {
    X: parseInt(localStorage.getItem('winsX')) || 0,
    O: parseInt(localStorage.getItem('winsO')) || 0
};

const winsXDisplay = document.getElementById('winsX');
const winsODisplay = document.getElementById('winsO');

function updateStatsDisplay() {
    winsXDisplay.textContent = wins.X;
    winsODisplay.textContent = wins.O;
}

// Funzioni reset

function resetScores() {
    wins = { X: 0, O: 0 };
    localStorage.setItem('winsX', '0');
    localStorage.setItem('winsO', '0');
    updateStatsDisplay();
}

function handleReset() {
    gameState = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    currentPlayer = 'X';
    statusDisplay.textContent = `Turno di ${getPlayerName(currentPlayer)}`;
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('winning-cell');
    });
    logList.innerHTML = '';
}

// Gestione del gioco
cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetScoreButton.addEventListener('click', resetScores);
resetButton.addEventListener('click', handleReset);

statusDisplay.textContent = `Turno di ${getPlayerName(currentPlayer)}`;

// Chiamata per mostrare vittorie
updateStatsDisplay();
