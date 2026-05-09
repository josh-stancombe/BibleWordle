<?php

ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/error.log');

$env = parse_ini_file(__DIR__ . '/.env');
if ($env === false) {
    error_log('guesses.php: failed to parse .env');
    http_response_code(500);
    exit;
}

$servername = $env['DB_HOST'];
$port       = (int) $env['DB_PORT'];
$username   = $env['DB_USER'];
$password   = $env['DB_PASS'];
$dbname     = $env['DB_NAME'];

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname, $port);

if ($conn->connect_error) {
    error_log('guesses.php: DB connection failed - ' . $conn->connect_error);
    http_response_code(500);
    exit;
}

// Setup database variables
$today = new DateTime();
$date = $today->format("d-m-Y");
$time = $today->format("H:i:s");
$userLocation = $_POST['userInfo']['city'] . ' - ' . $_POST['userInfo']['country_name'];
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
    $sql .= "INSERT INTO allguesses (date, time, userLocation, word, attempt, correctWord) VALUES ('$date', '$time', '$userLocation', '$word', '$attempt', '$correctWord');";

    // Correct Guesses (include score and scripture guess)
    if ($lastGuess === $attempt) {
        if ($word === $correctWord) {
            $sql .= "INSERT INTO correctguesses (date, time, userLocation, score, attempts, scriptureGuess, correctWord, clueUsed) VALUES ('$date', '$time', '$userLocation', '$score', '$attempt', '$scriptureGuess', '$correctWord', '$clueUsed');";
        }
    }
}

if ($conn->multi_query($sql) !== TRUE) {
    error_log('guesses.php: query failed - ' . $conn->error);
    http_response_code(500);
}

$conn->close();
