// find next empty cell to make a guess
function findEmpty(puzzle) {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (puzzle[i][j] == -1) {
                return [i, j];
            }
        }
    }
    return [null, null];
}

// checks whether the guess is valid
// it checks whether it has duplicated in its row, column, and 3x3 square
function validGuess(puzzle, guess, row, col) {
    // check if guess is present in the row
    let rowValues = puzzle[row];
    if (rowValues.includes(guess)) {
        return false;
    }

    // check if guess is present in the column
    let colValues = [];
    for (let i = 0; i < 9; i++) {
        colValues.push(puzzle[i][col]);
    }
    if (colValues.includes(guess)) {
        return false;
    }

    //check in the square
    let startRow = Math.floor(row / 3) * 3;
    let startCol = Math.floor(col / 3) * 3;

    for (let i = startRow; i < startRow + 3; i++) {
        for (let j = startCol; j < startCol + 3; j++) {
            if (puzzle[i][j] == guess) {
                if (i != row && j != col) {
                    return false;
                }
            }
        }
    }

    return true;
}


function sudokuSolver(puzzle) {
    // console.log(puzzle);
    const nextEmpty = findEmpty(puzzle);
    let row = nextEmpty[0];
    let col = nextEmpty[1];

    // console.log(row, col)
    if (row == null) {
        return true; 
    }

    // making guesses between 1 and 9
    for (let guess = 1; guess <= 9; guess++) {
        // console.log(guess)
        if (validGuess(puzzle, guess, row, col)) {
            puzzle[row][col] = guess;

            if (sudokuSolver(puzzle)) {
                // console.log(puzzle);
                return true;
            }
        }

        puzzle[row][col] = -1;
    }
    return false;
}


// const test = [
//     [3, 9, -1,   -1, 5, -1,   -1, -1, -1],
//     [-1, -1, -1,   2, -1, -1,   -1, -1, 5],
//     [-1, -1, -1,   7, 1, 9,   -1, 8, -1],

//     [-1, 5, -1,   -1, 6, 8,   -1, -1, -1],
//     [2, -1, 6,   -1, -1, 3,   -1, -1, -1],
//     [-1, -1, -1,   -1, -1, -1,   -1, -1, 4],

//     [5, -1, -1,   -1, -1, -1,   -1, -1, -1],
//     [6, 7, -1,   1, -1, 5,   -1, 4, -1],
//     [1, -1, 9,   -1, -1, -1,   2, -1, -1]
// ]

// console.log(sudokuSolver(test))
// console.log(test)

