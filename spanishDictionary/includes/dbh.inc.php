<?php

$servername = "localhost";
$dBUsername = "mramircr_spanish";
$dBPassword = "PKFuDD]p31h(";
$dBName = "mramircr_spanishDictionary";

// $servername = "localhost";
// $dBUsername = "root"; //default for xampp
// $dBPassword = ""; //default for xampp
// $dBName = "hashTest";



$conn = mysqli_connect($servername, $dBUsername, $dBPassword, $dBName);

if (!$conn) {
  die("Connection failed: " . mysqli_connect_error());
}
