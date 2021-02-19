window.onload = () => {
    geneatePastBoard();
}
const formInput = document.getElementById("sudoku-form");
const message = document.getElementById("message-p")
const livesMes = document.getElementById("lives")
const hintsMes = document.getElementById("hints")
let focusElement = 0;
let lives = JSON.parse(localStorage.getItem("lives")) + 1 || 3
localStorage.setItem("lives", JSON.stringify(lives - 1))
let hints = JSON.parse(localStorage.getItem("hints")) + 1 || 3
localStorage.setItem("hints", JSON.stringify(hints - 1))
lives--;
hints--;
let visits = JSON.parse(localStorage.getItem("visits")) || 1
if (visits == 1) {
    generateBoard("easy")
    lives = 3
    hints = 3
    localStorage.setItem("hints", JSON.stringify(3))
    localStorage.setItem("lives", JSON.stringify(3))
}
visits++
localStorage.setItem("visits", JSON.stringify(visits))
livesMes.innerHTML = lives
hintsMes.innerHTML = hints

document.getElementById("solve-button").addEventListener("click", solve);
document.getElementById("hint").addEventListener("click", giveHint)
document.getElementById("generate").addEventListener("click", readDifficultyAndGenerate);


function geneatePastBoard() {
    const board = JSON.parse(localStorage.getItem("no-solution"))
    const solution = JSON.parse(localStorage.getItem("with-solution"))
    if(board && solution) {
        writeValues(board, solution)
    }
    if (checkWin()) {
        document.getElementById("hint").disabled = true;
        document.getElementById("solve-button").disabled = true;
    }
    if (hints == 0) {
        document.getElementById("hint").disabled = true;
    }
    if (lives == 0) {
        message.innerHTML = "You have no more lives. You lost!"
        for (let i = 0; i < formInput.length; i++) {
            formInput[i].readOnly = true;
        }
    }
}

function giveHint() {
    if (formInput[focusElement].value == "") {
        hints -= 1;
        hintsMes.innerHTML = hints
        localStorage.setItem("hints", JSON.stringify(hints))
        if (hints == 0) {
            document.getElementById("hint").disabled = true;
            localStorage.setItem("hints", JSON.stringify(0))
        }
        formInput[focusElement].value = formInput[focusElement].dataset.solution
        formInput[focusElement].readOnly = true    
        let board = JSON.parse(localStorage.getItem("no-solution"))
        board[focusElement] = formInput[focusElement].dataset.solution
        localStorage.setItem("no-solution", JSON.stringify(board))
        if (checkWin()) {
            message.innerHTML = "You win!"
        }
    }
}

function readDifficultyAndGenerate() {
    document.getElementById("hint").disabled = false;
    document.getElementById("solve-button").disabled = false;
    livesMes.innerHTML = 3;
    hintsMes.innerHTML = 3;
    localStorage.setItem("hints", JSON.stringify(3))
    localStorage.setItem("lives", JSON.stringify(3))
    clearBoard();
    const difficulty = document.getElementById("difficulty").value
    generateBoard(difficulty)
}

function clearBoard() {
    for (let i = 0; i < 81; i++) {
        formInput[i].value = ""
        formInput[i].readOnly = false;
    }
}

function checkInput() {
    currentInput = formInput[focusElement].value
    if (currentInput <= 0 || currentInput > 9) {
        message.innerHTML = "Your recent input was invalid. It has been removed"
        formInput[focusElement].value = ""
        return;
    }
    const correctInput = formInput[focusElement].dataset.solution
    if (currentInput == correctInput) {
        message.innerHTML = ""
        formInput[focusElement].readOnly = true
        let board = JSON.parse(localStorage.getItem("no-solution"))
        board[focusElement] = correctInput
        localStorage.setItem("no-solution", JSON.stringify(board))
        if (checkWin()) {
            message.innerHTML = "You win!"
        }
    } else {
        formInput[focusElement].value = ""
        lives -= 1
        localStorage.setItem("lives", JSON.stringify(lives))
        livesMes.innerHTML = lives
        if (lives == 0) {
            message.innerHTML = "You have no more lives. You lost!"
            for (let i = 0; i < formInput.length; i++) {
                formInput[i].readOnly = true;
            }
            return;
        }
        message.innerHTML = "Your recent input was incorrect. It has been removed"
    }
}

function generateBoard(difficulty) {
    const URL = "https://sugoku.herokuapp.com/board?difficulty="
    const requestUrl = URL + difficulty
    
    axios.get(requestUrl)
    .then((data) => {
        let obtained_board = data.data.board 
        // Modify the data so that 0 becomes -1
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (obtained_board[i][j] == 0) {
                    obtained_board[i][j] = -1
                }
            }
        }
        const real_board = obtained_board.flat()
        localStorage.setItem("original", JSON.stringify(real_board))
        localStorage.setItem("no-solution", JSON.stringify(real_board))
        const is_solvable = sudokuSolver(obtained_board)

        if (is_solvable) {
            const real_solution = obtained_board.flat()
            localStorage.setItem("with-solution", JSON.stringify(real_solution))
            writeValues(real_board, real_solution)
        } else {
            localStorage.clear()
            alert("Error occurred, board generated is not solvable, please try again")
        }
        
    })
    .catch((err) => {
        console.error(err);
        alert("Error occurred, please try again later!")
    })
}

function setDemo() {
    const test = [
        [3, 9, -1,   -1, 5, -1,   -1, -1, -1],
        [-1, -1, -1,   2, -1, -1,   -1, -1, 5],
        [-1, -1, -1,   7, 1, 9,   -1, 8, -1],

        [-1, 5, -1,   -1, 6, 8,   -1, -1, -1],
        [2, -1, 6,   -1, -1, 3,   -1, -1, -1],
        [-1, -1, -1,   -1, -1, -1,   -1, -1, 4],

        [5, -1, -1,   -1, -1, -1,   -1, -1, -1],
        [6, 7, -1,   1, -1, 5,   -1, 4, -1],
        [1, -1, 9,   -1, -1, -1,   2, -1, -1]
    ]
    let demo = test.flat();
    sudokuSolver(test);
    let demo_sol = test.flat()
    writeValues(demo, demo_sol);
}

function setFocus() {
    for (let i = 0; i < formInput.length; i++) {
        if (formInput[i] === document.activeElement) {
            focusElement = i;
        }
    }
}

function writeValues(nums, solved) {
    for (let i = 0; i < nums.length; i++) {
        if (nums[i] != -1) {
            formInput[i].value = nums[i];
            formInput[i].readOnly = true;
            const original = JSON.parse(localStorage.getItem("original"))
            if (nums[i] == original[i] && nums[i] != -1) {
                formInput[i].style.fontWeight = "bold";
            }
        }
        formInput[i].dataset.solution = solved[i]
        formInput[i].dataset.index = i;
        formInput[i].onfocus = setFocus
        formInput[i].oninput = checkInput
    }
}

function checkWin() {
    for (let i = 0; i < formInput.length; i++) {
        if (formInput[i].value == "") {
            return false;
        }
    }
    return true;
}

function solve() {
    document.getElementById("hint").disabled = true;
    document.getElementById("solve-button").disabled = true;
    for (let i = 0; i < formInput.length; i++) {
        if (formInput[i].value == "") {
            formInput[i].value = formInput[i].dataset.solution
            formInput[i].readOnly = true
        }
    }
    const solution = JSON.parse(localStorage.getItem("with-solution"))
    localStorage.setItem("no-solution", JSON.stringify(solution))
}

