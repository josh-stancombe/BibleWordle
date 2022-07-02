
let correctWord = 'spice';
let wordCounter = 0;
let letterCounter = 0;

// Note word and letetr counters are 0 indexed.

$(document).ready(function(){
    
    // Physical Keyboard Logic
    document.addEventListener('keydown', (e) => {
        if (e.keyCode >= 65 && e.keyCode <= 90) { 
           letterLogic(e.key.toUpperCase());
        } else if (e.keyCode === 13) {
            evaluateUserWord();
        } else if (e.keyCode === 8) {
            removeLetter();
        }         
    });

    // On-Screen Keyboard Logic
    $(".keyboardLetter").click(function(){ 
        letterLogic(this.innerHTML); 
    });
    $("#letterKeyEnter").click(function(){
        evaluateUserWord();
    });
    $("#letterKeyRemove").click(function(){
        removeLetter();
    });
});

async function evaluateUserWord() {

    if (letterCounter != 5) {
        $('#notificationModal').modal('toggle');       
        $('#notificationText').html('Please enter a five letter word!');
        return;
    }

    let userWordGuess = '';
    let correctWordRemainingLetters = correctWord;

    // This is required to eliminate bugs with duplicate letters in a word to stop them also appearing orange!
    for (i=0; i<5; i++){
        userWordGuess += document.getElementById(`word${wordCounter}Letter${i}`).innerHTML.toLowerCase();
    }

    for (i=0; i<5; i++){

        let userLetterGuess = userWordGuess[i];

        // If guess letter in correct word && only 1 of that letter left in the guess word && isn't in correct place...
        if (correctWordRemainingLetters.includes(userLetterGuess) && (userWordGuess.split(userLetterGuess).length-1 === 1) && correctWordRemainingLetters[i] !== userLetterGuess) {
            className = 'letterInWord'
        } else if (correctWordRemainingLetters[i] === userLetterGuess){
            className = 'correctLetter';
            correctWordRemainingLetters = correctWordRemainingLetters.replace(`${userLetterGuess}`,`_`);
        } else {
            className = 'wrongLetter';
        }
        
        tileAddClass(i, className);
        keyboardAddClass(userLetterGuess.toUpperCase(), className);

        userWordGuess = userWordGuess.replace(`${userLetterGuess}`,`_`);
    }

    if (userWordGuess === correctWord) {
        alert("Wooho you have won!");
    }

    wordCounter++;
    letterCounter = 0;

    // Display Clue button if User is on 5th or more go.
    if (wordCounter === 4) {
        document.getElementById(`clueButton`).style.visibility = "visible"; 
    }
}

function removeLetter() {
    let currentLetter = `word${wordCounter}Letter${letterCounter -1}`;
    $(`#${currentLetter}`).html('');
    if (letterCounter != 0) {
        letterCounter--;
    }
}

function tileAddClass(i, className){
    document.getElementById(`word${wordCounter}Letter${i}`).classList.add(className)
}

function keyboardAddClass(letter, className){
    document.getElementById(`letterKey${letter}`).classList.add(className);
}

function letterLogic(letterSelection){
    let currentLetter = `word${wordCounter}Letter${letterCounter}`;

    if (letterCounter > 4) {
        $('#notificationModal').modal('toggle');       
        $('#notificationText').html('You can only enter five characters!');
        return;
    }

    $(`#${currentLetter}`).html(letterSelection);
    letterCounter++;
}