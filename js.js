function loadPvsP() {
    document.getElementById("player1-label").innerHTML = "Người chơi 1";
    document.getElementById("player2-label").innerHTML = "Người chơi 2";
    document.getElementById("container").style.display = "flex";
    document.getElementById("mode-selection").style.display = "none";
    mode = "PvsP";
    setupBoard()
}

function loadPvsC() {
    document.getElementById("player1-label").innerHTML = "Người chơi";
    document.getElementById("player2-label").innerHTML = "Máy tính";
    document.getElementById("container").style.display = "flex";
    document.getElementById("mode-selection").style.display = "none";
    mode = "PvsC";
    setupBoard();
}

let board = [];
let rows = 15;
let cols = 20;
let mode = "";
let currentPlayer = "X";
let lastMove = {};
let interval = null;

function computerPlay() {
    if (mode === "PvsC" && currentPlayer === "O") {
        computerMove(lastMove);
    }
}

function setupBoard() {
    let boards = "<table>";
    for (let i = 0; i < rows; i++) {
        boards += "<tr>";
        for (let j = 0; j < cols; j++) {
            boards += `<td id="${i}_${j}" onclick="xclick(this)"></td>`;
        }
        boards += "</tr>";
    }
    boards += "</table>";
    document.getElementById('board-container').innerHTML = boards;
    setArray()
    setTimeout(() => alert(`Người chơi ${currentPlayer} đi trước!`), 100);
    interval = setInterval(computerPlay, 200);
}

function setArray() {
    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < cols; j++) {
            board[i][j] = "";
        }
    }
}

function checkWin(row, col) {
    // Check theo hàng
    let count = 0;
    let winCells = [];
    for (let j = 0; j < cols; j++) {
        if (board[row][j] === currentPlayer) {
            count++;
            winCells.push({row: row, col: j});
            if (count === 5) {
                highlightCells(winCells);
                return true;
            }
        } else {
            count = 0;
            winCells = [];
        }
    }

    // Check theo cột
    count = 0;
    winCells = [];
    for (let i = 0; i < rows; i++) {
        if (board[i][col] === currentPlayer) {
            count++;
            winCells.push({row: i, col: col});
            if (count === 5) {
                highlightCells(winCells);
                return true;
            }
        } else {
            count = 0;
            winCells = [];
        }
    }

    // Check đường chéo chính
    count = 0;
    winCells = [];
    let i = row;
    let j = col;
    while (i > 0 && j > 0) {
        i--;
        j--;
    }
    while (i < rows && j < cols) {
        if ( board[i][j] === currentPlayer ) {
            count++;
            winCells.push({row: i, col: j});
            if (count === 5) {
                highlightCells(winCells);
                return true;
            }
        } else {
            count = 0;
            winCells = [];
        }
        i++;
        j++;
    }

    // Check đường chéo phụ
    count = 0;
    winCells = [];
    i = row;
    j = col;

    while (i > 0 && j < cols) {
        i--;
        j++;
    }

    while (i < rows && j >= 0) {
        if (board[i][j] === currentPlayer) {
            count++;
            winCells.push({row: i, col: j});
            if (count === 5) {
                highlightCells(winCells);
                return true;
            }
        } else {
            count = 0;
            winCells = [];
        }
        i++;
        j--;
    }

    return false;
}

function highlightCells(cells) {
    for (let cell of cells) {
        const td = document.getElementById(`${cell.row}_${cell.col}`);
        td.style.background = "#ffa20a";
    }
}

function undoMove() {
    if (confirm('Bạn có muốn đi lại không ?!')) {
        document.getElementById(`${lastMove.row}_${lastMove.col}`).innerHTML = "";
        switchPlayer();
    }
}

function resetBoard() {
    if (confirm('Bạn có muốn tạo lại bàn cờ mới không ?!')) {
        switchPlayer();
        setupBoard();
    }
}

function resetHistory() {
    if (confirm("Bạn có chắc chắn muốn xóa hết lịch sử không?! ")) {
        document.getElementById("player1-wins").value = 0;
        document.getElementById("player2-wins").value = 0;
        resetBoard()
    }
}

function xclick(td) {
    if (td.innerHTML === "") {
        const row = td.parentNode.rowIndex;
        const col = td.cellIndex;
        lastMove.row = row;
        lastMove.col = col;
        board[row][col] = currentPlayer;
        td.innerHTML = currentPlayer;
        if (currentPlayer === "X") {
            td.style.color = "blue";
        } else {
            td.style.color = "red";
        }
        if (checkWin(row, col)) {
            setTimeout(function () {
                alert(`Người chơi ${currentPlayer} đã thắng!`);
                clearInterval(interval);
                resetBoard();
            }, 200);
            if (currentPlayer === "X") {
                document.getElementById("player1-wins").value = parseInt(document.getElementById("player1-wins").value) + 1;
            } else {
                document.getElementById("player2-wins").value = parseInt(document.getElementById("player2-wins").value) + 1;
            }
        } else {
            switchPlayer();
        }
    }
}

function switchPlayer() {
    if (currentPlayer === "X") {
        currentPlayer = "O";
    } else {
        currentPlayer = "X";
    }
}

function computerMove(lastMove) {
    let bestMove = getBestMove(lastMove.row, lastMove.col);
    board[bestMove.row][bestMove.col] = 'O';
    let computerTd = document.getElementById(`${bestMove.row}_${bestMove.col}`);
    computerTd.innerHTML = 'O';
    computerTd.style.color = 'red';
    if (checkWin(bestMove.row, bestMove.col)) {
        setTimeout(function () {
            alert(`Máy tính đã thắng!`);
            resetBoard();
        }, 200);
        document.getElementById("player2-wins").value = parseInt(document.getElementById("player2-wins").value) + 1;
    } else {
        switchPlayer();
    }
}

function getBestMove(row, col) {
    let moves = [];


    // Lấy danh sách các ô cờ trong phạm vi xung quanh ô vừa đánh
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (i !== 0 || j !== 0) {
                const r = row + i;
                const c = col + j;
                if (r >= 0 && r < 15 && c >= 0 && c < 20 && board[r][c] === "") {
                    moves.push({row: r, col: c});
                }
            }
        }
    }
    const randomIndex = Math.floor(Math.random() * moves.length);
    return moves[randomIndex];
}

