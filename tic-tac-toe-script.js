document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('board');
    const message = document.getElementById('message');
    const resetButton = document.getElementById('resetButton');
    const toggleAIButton = document.getElementById('toggleAIButton');
    const difficultySelect = document.getElementById('difficulty');
    let currentPlayer = 'X';
    let cells = ['', '', '', '', '', '', '', '', ''];
    let gameActive = true;
    let aiEnabled = false;
    let difficulty = 'easy';

    const renderBoard = () => {
        board.innerHTML = '';
        cells.forEach((value, index) => {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.textContent = value;
            cell.addEventListener('click', () => handleCellClick(index));
            board.appendChild(cell);
        });
    };

    const handleCellClick = (index) => {
        if (gameActive && cells[index] === '') {
            cells[index] = currentPlayer;
            renderBoard();
            checkGameStatus();
            if (gameActive) {
                currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
                if (aiEnabled && currentPlayer === 'O') {
                    aiMove();
                }
            }
        }
    };

    const aiMove = () => {
        if (difficulty === 'easy') {
            makeRandomMove();
        } else if (difficulty === 'medium') {
            if (!makeWinningMove()) {
                makeRandomMove();
            }
        } else if (difficulty === 'hard') {
            if (!makeWinningMove()) {
                if (!blockOpponentWinningMove()) {
                    makeRandomMove();
                }
            }
        }
        renderBoard();
        checkGameStatus();
        currentPlayer = 'X';
    };

    const makeRandomMove = () => {
        let availableCells = cells.map((cell, index) => cell === '' ? index : null).filter(val => val !== null);
        if (availableCells.length > 0) {
            let randomIndex = availableCells[Math.floor(Math.random() * availableCells.length)];
            cells[randomIndex] = 'O';
        }
    };

    const makeWinningMove = () => {
        return findBestMove('O');
    };

    const blockOpponentWinningMove = () => {
        return findBestMove('X');
    };

    const findBestMove = (player) => {
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

        for (const condition of winningConditions) {
            const [a, b, c] = condition;
            if (cells[a] === player && cells[b] === player && cells[c] === '') {
                cells[c] = 'O';
                return true;
            }
            if (cells[a] === player && cells[b] === '' && cells[c] === player) {
                cells[b] = 'O';
                return true;
            }
            if (cells[a] === '' && cells[b] === player && cells[c] === player) {
                cells[a] = 'O';
                return true;
            }
        }
        return false;
    };

    const checkGameStatus = () => {
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

        for (const condition of winningConditions) {
            const [a, b, c] = condition;
            if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
                gameActive = false;
                message.textContent = `${cells[a]} wins!`;
                return;
            }
        }

        if (!cells.includes('')) {
            gameActive = false;
            message.textContent = 'It\'s a tie!';
        }
    };

    resetButton.addEventListener('click', () => {
        cells = ['', '', '', '', '', '', '', '', ''];
        currentPlayer = 'X';
        gameActive = true;
        message.textContent = '';
        renderBoard();
    });

    toggleAIButton.addEventListener('click', () => {
        aiEnabled = !aiEnabled;
        toggleAIButton.textContent = aiEnabled ? 'Play against Human' : 'Play against AI';
        resetButton.click(); // Reset the game when changing modes
    });

    difficultySelect.addEventListener('change', (e) => {
        difficulty = e.target.value;
    });

    renderBoard();
});
