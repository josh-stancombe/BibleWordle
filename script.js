
import { todaysWord } from './assets/bibleWords.mjs';
import { validWords } from './assets/validWords.mjs';

// - Word and Letter counters are 0 indexed.
let correctWord = todaysWord['word'].toLowerCase();
let wordCounter = 0;
let letterCounter = 0;

let userScore = 0;
let wordScore = 0;
let clueUsed = false;

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

    // Generate Clue
    $("#clueButton").click(function(){
        generateClue();
    });

});

function evaluateUserWord() {

    if (letterCounter != 5) {
        $('#invalidLengthModal').modal('toggle');       
        return;
    }

    let userWordGuess = '';
    let correctWordRemainingLetters = correctWord;

    // This is required to eliminate bugs with duplicate letters in a word to stop them also appearing orange!
    for (let i=0; i<5; i++){
        userWordGuess += document.getElementById(`word${wordCounter}Letter${i}`).innerHTML.toLowerCase();
    }

    // Store the word in guessedWord, as userWordGuess variable will be changed.
    let guessedWord = userWordGuess;

    // Check if guess is a valid word
    if (!validWords.includes(userWordGuess)) {
        $('#invalidWordModal').modal('toggle');
        return;
    }

    for (let i=0; i<5; i++){

        let userLetterGuess = userWordGuess[i];
        let className = '';

        // If guess letter in correct word && only 1 of that letter left in the guess word && isn't in correct place...
        if (correctWordRemainingLetters.includes(userLetterGuess) && (userWordGuess.split(userLetterGuess).length-1 === 1) && correctWordRemainingLetters[i] !== userLetterGuess) {
            className = 'letterInWord'
        } else if (correctWordRemainingLetters[i] === userLetterGuess){
            className = 'correctLetter';
            correctWordRemainingLetters = correctWordRemainingLetters.replace(`${userLetterGuess}`,`_`);
        } else {
            className = 'wrongLetter';
        }        
       
        // Add tile styling and increment letter / word counters.
        addTileClass(i, className);        
        keyboardAddClass(i, userLetterGuess.toUpperCase(), className);

        userWordGuess = userWordGuess.replace(`${userLetterGuess}`,`_`)
    }

    // If guess is correct...
    if (guessedWord === correctWord) {       
        // Show Win Modal
        setTimeout(function(){
            displayWinModal()
        }, 3000);
    } else {
        // Display Clue button if User is on 4th or more go.
        if (wordCounter === 3) {
            $('#clueButton').delay(2500).fadeIn(1000);
        }
    }
}

function removeLetter() {
    let currentLetter = `word${wordCounter}Letter${letterCounter -1}`;
    $(`#${currentLetter}`).html('');
    if (letterCounter != 0) {
        letterCounter--;
    }
}

function addTileClass (i, className) {
    setTimeout(function() {
        document.getElementById(`word${wordCounter}Letter${i}`).classList.add(className);
        if (i === 4) {
            wordCounter++;
            letterCounter = 0;
        } 
    }, i*500);
}

function keyboardAddClass(i, letter, className){
    setTimeout(function() {
        document.getElementById(`letterKey${letter}`).classList.add(className);
    }, i*500);
}

function letterLogic(letterSelection){
    let currentLetter = `word${wordCounter}Letter${letterCounter}`;

    if (letterCounter > 4) {
        return;
    }

    $(`#${currentLetter}`).html(letterSelection);
    letterCounter++;
}

function generateClue() {   
    let clueText = todaysWord['clue'];    
    $('#clueText').html(`${clueText}`);
    
    $('#clueModal').modal('toggle');
    clueUsed = true;
    return;
}

function displayWinModal() {
    $('#winModal').modal('toggle');
    $('#winModalHeader').html(todaysWord['word']);
    $('#scriptureBook').html(`<a target="_blank" id="scriptureBookRef" class="blurBox" href='${todaysWord['link']}'><u>${todaysWord['scriptureRef']}</u></a>`);
    $('#scriptureText').html(`${todaysWord['scripture']} <a id="readMoreLink" target="_blank" href='${todaysWord['link']}'>Read Chapter...</a>`);

    $("#submitBookGuess").click(function(){
        loadAdditionalSections();
    });

    $("#unsureBookGuess").click(function(){
        loadAdditionalSections();        
    });

};

function loadAdditionalSections() {
    $('#scriptureBook').slideDown("normal");

    // Add styling to book select menu.  
    $('#submitBookGuess').hide();
    $('#unsureBookGuess').hide();
    
    let userBookGuess = $('#bookSelect').val();        
    let scripturePoint = false;
    if (userBookGuess == todaysWord['scriptureBook']) {
        $('#correctBookGuess').show();
        scripturePoint = true;
    } else {
        $('#wrongBookGuess').show();
    }

    // Load the Score Section
    calculateScore(scripturePoint);
    $('#userScore').html(userScore);
    $('#wordGuesses').html(wordScore);
    scripturePoint === false ? $('#scriptureGuess').html(0) : $('#scriptureGuess').html(1);
    clueUsed === true ? $('#clueUsed').html('Yes') : $('#clueUsed').html('No');
    $('#scoreSection').slideDown("normal");
    
    // Load the Question Section
    setTimeout(function(){
        $('#questionSection').slideDown("normal");
    }, 2500);
}

function calculateScore(scripturePoint) {
    // Set Temp Score (score calculates from second guess)
    userScore = (7 - wordCounter);
    if (userScore === 6) {
        userScore = 5; 
    } 

    wordScore = userScore;

    scripturePoint === true ? userScore++ : '';

    if (userScore === 0) {
        userScore = 1; 
    } 
    
}