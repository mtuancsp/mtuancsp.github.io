
let board = [];
let rows = 15;
let cols = 23;
let mode = "";
let currentPlayer = "X";
let lastMove = {};

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

    if ( mode === "PvsC" && currentPlayer === "O"){
        setTimeout(() => {alert(`Máy tính đi trước!`);computerPlay()}, 200);
    } else {
        setTimeout(() => alert(`Người chơi ${currentPlayer} đi trước!`), 200);
    }
}

function setArray() {
    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < cols; j++) {
            board[i][j] = "";
        }
    }
}

function switchPlayer() {
    currentPlayer = (currentPlayer === "X") ? "O" : "X";
}

function undoMove() {
    if (confirm('Bạn có muốn đi lại không ?!')) {
        document.getElementById(`${lastMove.row}_${lastMove.col}`).innerHTML = "";
        switchPlayer();
    }
}

function resetBoard() {
    if (confirm('Bạn có muốn tạo lại bàn cờ mới không ?!')) {
        setupBoard();
    }
}

function resetHistory() {
    if (confirm("Bạn có chắc chắn muốn xóa hết lịch sử không?! ")) {
        document.getElementById("player1-wins").value = 0;
        document.getElementById("player2-wins").value = 0;
        setTimeout(()=>resetBoard(),200);
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
        td.style.background = "orange";
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
                switchPlayer();
                resetBoard();
            }, 200);
            if (currentPlayer === "X") {
                document.getElementById("player1-wins").value = parseInt(document.getElementById("player1-wins").value) + 1;
            } else {
                document.getElementById("player2-wins").value = parseInt(document.getElementById("player2-wins").value) + 1;
            }
        } else {
            switchPlayer();
            computerPlay();
        }
    }
}

function computerPlay() {
    if (mode === "PvsC" && currentPlayer === "O") {
        computerMove(lastMove);
    }
}

function computerMove(lastMove) {
    let bestMove = getComMove(lastMove.row, lastMove.col);
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


function getComMove(row, col) {
    let moves = [];

    // Check phạm vi 3x3
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (i !== 0 || j !== 0) {
                const r = row + i;
                const c = col + j;
                let r2;
                let c2
                if (r >= 0 && r < rows && c >= 0 && c < cols && board[r][c] === "X") {
                    if (r + i >= 0 && r + i < rows && c + j >= 0 && c + j < cols && board[r + i][c + j] === "X"){
                        r2 = row - i;
                        c2 = col - j;
                    } else
                    if (row - i >= 0 && row - i < rows && col - j >= 0 && col - j < cols && board[row - i][col - j] === "X"){
                        r2 = row - i-i;
                        c2 = col - j-j;
                    } else
                    if (row - i >= 0 && row - i < rows && col - j >= 0 && col - j < cols && board[row - i][col - j] === ""){
                        r2 = row - i;
                        c2 = col - j;
                    }
                    if (r2 >= 0 && r2 < rows && c2 >= 0 && c2 < cols && board[r2][c2] === "") {
                        return {row: r2, col: c2};
                    }
                }
            }
        }
    }

    // Check phạm vi 5x5
        for (let i = -2; i <= 2; i++) {
            for (let j = -2; j <= 2; j++) {
                if (i !== 0 || j !== 0) {
                    const r = row + i + i;
                    const c = col + j + + j;
                    if (r >= 0 && r < rows && c >= 0 && c < cols && board[r][c] === "X") {
                        const r2 = row + i;
                        const c2 = col + j;
                        if (r2 >= 0 && r2 < rows && c2 >= 0 && c2 < cols && board[r2][c2] === "") {
                            return {row: r2, col: c2};
                        }
                    }
                }
            }
        }

    // Nếu không có thì chọn ngẫu nhiên
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            const r = row + i;
            const c = col + j;
            if (r >= 0 && r < rows && c >= 0 && c < cols && board[r][c] === "") {
                moves.push({row: r, col: c});
            }
        }
    }

    const randomIndex = Math.floor(Math.random() * moves.length);
    const randomRow = moves[randomIndex].row;
    const randomCol = moves[randomIndex].col;
    return {row: randomRow, col: randomCol};

}




