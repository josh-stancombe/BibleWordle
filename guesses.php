<?php

$servername = "localhost";
$username = "";
$password = "";
$dbname = "";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

// Setup database variables
$today = new DateTime();
$date = $today->format("d-m-Y");
$time = $today->format("H:i:s");
$userInfo = $_POST['userInfo']['city'] . ' - ' . $_POST['userInfo']['country'];
$ipAddress = $_POST['userInfo']['ip_address'];
$guessInfo = $_POST['guessInfo'];
$score = $_POST['score'];
$correctWord = $_POST['correctWord'];
$scriptureGuess = $_POST['scriptureGuess'];
$clueUsed = $_POST['clueUsed'];

$lastGuess = count($guessInfo);
$sql = '';

foreach($guessInfo as $attempt => $word) {

    $attempt++; // Attempt is 0 indexed
    
    // All Guesses
    $sql .= "INSERT INTO allguesses (date, time, userLocation, ipAddress, word, attempt, correctWord) VALUES ('$date', '$time', '$userInfo', '$ipAddress', '$word', '$attempt', '$correctWord');";

    // Correct Guesses (include score and scripture guess)
    if ($lastGuess === $attempt) {
        if ($word === $correctWord) {
            $sql .= "INSERT INTO correctguesses (date, time, userLocation, ipAddress, score, attempts, scriptureGuess, correctWord, clueUsed) VALUES ('$date', '$time', '$userInfo', '$ipAddress', '$score', '$attempt', '$scriptureGuess', '$correctWord', '$clueUsed');";
        }
    }
}

if ($conn->multi_query($sql) !== TRUE) {
    echo "Error: " . $sql . "<br>" . $conn->error;
}

$conn->close();

?>