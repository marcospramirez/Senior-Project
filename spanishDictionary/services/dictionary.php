<?php
require_once("db.php");

$conn = returnConnection();

if(isset($_GET["email"])) {  //if data in post, check user
    $email = $_GET["email"];
    //get all dictionary names for specific user
    $sql = "SELECT e.entryAudioPath, e.entryText, e.entryDefinition FROM entry e, entrytodictionary t, dictionary d WHERE e.entryID = t.entryID AND t.dictionaryID = d.dictionaryID AND d.dictionaryID = 7;";
    $dictionaryString = '';

    if ($result = $conn->query($sql)) { //query successful
        while ($row = $result->fetch_assoc()) {
            $dictionaryString .= $row['name']."||";
        }
        print $dictionaryString;
    }
    else {  //fail: show error message
        echo "Error: " . $sql . "<br>" . $conn->error;
    }
}//end of check if there is data in post

closeConnection($conn);