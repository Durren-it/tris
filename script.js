const board = document.getElementById('board');
const cells = document.querySelectorAll('.cell');
const resetButton = document.getElementById('resetButton');
const statusDisplay = document.getElementById('status');
const themeSelector = document.getElementById('theme');
let currentPlayer = 'X';
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
    clickedCell.textContent = currentPlayer;

    checkResult();
    if (gameActive) {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        statusDisplay.textContent = `Turno di ${getPlayerName(currentPlayer)}`;
    }
}

// Gestione nome player
function getPlayerName(symbol) {
    return symbol === 'X' ? 'Giocatore 1 - X' : 'Giocatore 2 - O';
}

// Funzione di controllo stato gioco
function checkResult() {
    let roundWon = false;
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
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

// Funzione reset
function handleReset() {
    gameState = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    currentPlayer = 'X';
    statusDisplay.textContent = `Turno di ${getPlayerName(currentPlayer)}`;
    cells.forEach(cell => cell.textContent = '');
}

// Gestione del gioco
cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetButton.addEventListener('click', handleReset);

statusDisplay.textContent = `Turno di ${getPlayerName(currentPlayer)}`;

// Chiamata per mostrare vittorie
updateStatsDisplay();
