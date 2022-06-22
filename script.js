let boardDisplay = (function () {
    'use strict';
    // Cache DOM
    let boardElem = document.querySelectorAll('.board > *');

    let boardArr = new Array(9).fill("");


    function _renderCell(sign, position) {
        boardArr[position] = sign;
        boardElem[position].textContent = sign;
    }

    // 'X' == player 1; 'O' == player 2
    function makeMove(sign, position) {

        if (boardArr[position - 1] != "" || // check for invalid input
            position < 1 || position > 9 ||
            !(sign == "O" || sign == "X")) {
            console.log("error");
            return 0; // return 0 as "failed"
        }

        _renderCell(sign, position - 1);  //position-1 because arrays start from index 0
        if (sign == "X") {
            boardElem[position - 1].classList.add("player-one");
        }
        else if (sign == "O") {
            boardElem[position - 1].classList.add("player-two");
        }
        return 1; // return 1 as "success"
    }

    function getBoardArr() {
        return boardArr;
    }

    function getBoardElem() {
        return boardElem;
    }
    return {
        makeMove, getBoardArr, getBoardElem
    }
})();


let gameBoard = (function () {

    // state variables
    let winner = 0;  //0 == no winner ; 1 == player 1 wins ; 2 == player 2 wins ; 3 == draw
    let currentInput = "X"; // for tracking the player currently making a move

    //Cache DOM
    let playerOneDiv = document.querySelector('.player-one');
    let playerTwoDiv = document.querySelector('.player-two');
    let endGameWindowWrap = document.querySelector('.endgame-window-wrap');
    let windowText = document.querySelector('.window > .text');
    let restartButton = document.querySelector('button');

    function _init() {
        boardDisplay.getBoardElem().forEach((element) => {
            element.addEventListener('click', () => {
                if (currentInput == "X") {
                    _movePlayerOne(element.getAttribute("data-cell-num"));
                }
                else if (currentInput == "O") {
                    _movePlayerTwo(element.getAttribute("data-cell-num"));
                }

                let result = _checkBoard();

                if (result != 0) {
                    endGameWindowWrap.classList.remove('hide');
                    if (result == 1) {
                        windowText.textContent = "Player 1 wins!";
                    }
                    else if (result == 2) {
                        windowText.textContent = "Player 2 wins!";
                    }
                    else {
                        windowText.textContent = "Draw!";
                    }
                }

            })
        })


        restartButton.addEventListener('click', () => {
            document.location.reload();
        })

    }

    _init();

    function _movePlayerOne(currentCellPosition) {
        if (boardDisplay.makeMove(currentInput, currentCellPosition)) {
            currentInput = "O";  // transfer move to Player 2
            playerOneDiv.classList.add('hide');
            playerTwoDiv.classList.remove('hide');
        }
    }

    function _movePlayerTwo(currentCellPosition) {
        if (boardDisplay.makeMove(currentInput, currentCellPosition)) {
            currentInput = "X";  // transfer move to Player 1 if move is correct
            playerTwoDiv.classList.add('hide');
            playerOneDiv.classList.remove('hide');
        }
    }

    // Check board for winning combination
    // or for a draw
    function _checkBoard() {
        let currentBoardArr = boardDisplay.getBoardArr();
        function boardLookUp(pos) { return currentBoardArr[pos - 1]; } //helper function for convinient look-up
        let winner = 0;

        /*****   check if 'X' player one has a winning combination          ********/
        if ((boardLookUp(1) == 'X' && boardLookUp(2) == 'X' && boardLookUp(3) == 'X') //check for (1,2,3)  (4,5,6) (7,8,9) win combinations
            || (boardLookUp(4) == 'X' && boardLookUp(5) == 'X' && boardLookUp(6) == 'X')
            || (boardLookUp(7) == 'X' && boardLookUp(8) == 'X' && boardLookUp(9) == 'X')) {
            winner = 1;
            return winner;
        }

        if ((boardLookUp(1) == 'X' && boardLookUp(4) == 'X' && boardLookUp(7) == 'X') //check for (1,4,7)  (2,5,8) (3,6,9) win combinations
            || (boardLookUp(2) == 'X' && boardLookUp(5) == 'X' && boardLookUp(8) == 'X')
            || (boardLookUp(3) == 'X' && boardLookUp(6) == 'X' && boardLookUp(9) == 'X')) {
            winner = 1;
            return winner;
        }

        if ((boardLookUp(1) == 'X' && boardLookUp(5) == 'X' && boardLookUp(9) == 'X') //check for (1,5,9)  (3,5,7) win combinations
            || (boardLookUp(3) == 'X' && boardLookUp(5) == 'X' && boardLookUp(9) == 'X')) {
            winner = 1;
            return winner;
        }

        /*****   check if 'O' player two has a winning combination          ********/

        if ((boardLookUp(1) == 'O' && boardLookUp(2) == 'O' && boardLookUp(3) == 'O') //check for (1,2,3)  (4,5,6) (7,8,9) win combinations
            || (boardLookUp(4) == 'O' && boardLookUp(5) == 'O' && boardLookUp(6) == 'O')
            || (boardLookUp(7) == 'O' && boardLookUp(8) == 'O' && boardLookUp(9) == 'O')) {
            winner = 2;
            return winner;
        }

        if ((boardLookUp(1) == 'O' && boardLookUp(4) == 'O' && boardLookUp(7) == 'O') //check for (1,4,7)  (2,5,8) (3,6,9) win combinations
            || (boardLookUp(2) == 'O' && boardLookUp(5) == 'O' && boardLookUp(8) == 'O')
            || (boardLookUp(3) == 'O' && boardLookUp(6) == 'O' && boardLookUp(9) == 'O')) {
            winner = 2;
            return winner;
        }

        if ((boardLookUp(1) == 'O' && boardLookUp(5) == 'O' && boardLookUp(9) == 'O') //check for (1,5,9)  (3,5,7) win combinations
            || (boardLookUp(3) == 'O' && boardLookUp(5) == 'O' && boardLookUp(7) == 'O')) {
            winner = 2;
            return winner;
        }

        let draw = true;
        for (let i = 0; i < 9; i++) {
            if (currentBoardArr[i] == "") {
                draw = false
            }
        }

        console.log(`Draw ${draw}`);

        if (draw == true) {
            winner = 3;
            return winner;
        }

        return winner;
    }

})();