function loadPvsP() {
    document.getElementById("player1-label").innerHTML = "Người chơi 1";
    document.getElementById("player2-label").innerHTML = "Người chơi 2";
    document.getElementById("container").style.display = "flex";
    document.getElementById("mode-selection").style.display = "none";
    mode = "PvsP";
    setupBoard()
}

function showDifficulty() {
    document.querySelector("#mode").style.display = "none";
    document.querySelector("#pvsc-difficulty").style.display = "block";
}

function loadPvsC() {
    document.getElementById("player1-label").innerHTML = "Người chơi";
    document.getElementById("player2-label").innerHTML = "Máy tính";
    document.getElementById("container").style.display = "flex";
    document.getElementById("mode-selection").style.display = "none";
    mode = "PvsC";
    setupBoard();
}

function showRules() {
    document.getElementById("rules-modal").style.display = "block";
}

function hideRules() {
    document.getElementById("rules-modal").style.display = "none";
}

function showInfo() {
    document.getElementById("info-modal").style.display = "block";
}

function hideInfo() {
    document.getElementById("info-modal").style.display = "none";
}