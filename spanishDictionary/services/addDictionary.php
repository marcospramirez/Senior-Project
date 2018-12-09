<?php
require_once("db.php");

$conn = returnConnection();

$classID = $_POST['class'];

if(isset($_POST["dictionaryName"])) {
    $dictionaryName = $_POST["dictionaryName"];

    $sql = "INSERT INTO dictionary (dictionaryID, dictionaryName) VALUES (NULL, '$dictionaryName');";

    if ($conn->query($sql) === TRUE) {  //success: created new dictionary, now add dictionary to classroom
        $dictionaryID = $conn->insert_id;

        $sql = "INSERT INTO classroomtodictionary (classID, dictionaryID) VALUES ('$classID', '$dictionaryID');";

        if ($conn->query($sql) === TRUE) {  //success: added dictionary to classroom, return dictionaryID
            print_r(count($_FILES['termAudio']['name']));
            echo $dictionaryID;
        }
        else {  //fail: show error message
            echo "Error: " . $sql . "<br>" . $conn->error;
        }
    }
    else {  //fail: show error message
        echo "Error: " . $sql . "<br>" . $conn->error;
    }
}

closeConnection($conn);