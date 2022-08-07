<?php

echo "Hello There!";

$servername = "localhost";
$username = "root";
//$password = "";

// Create connection
$conn = new mysqli($servername, $username);

// Check connection
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}
echo "Connected successfully";
?>