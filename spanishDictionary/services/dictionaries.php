<?php
require_once("db.php");

$conn = returnConnection();

if(isset($_GET["email"])) {  //
    $email = $_GET["email"];
    //get all dictionary names for specific user
    $sql = "SELECT d.dictionaryName AS 'name' FROM instructor i, classroom c, classroomtodictionary t, dictionary d WHERE i.email = '$email' AND i.email = c.instructorEmail AND c.classID = t.classID AND t.dictionaryID = d.dictionaryID;";

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
elseif(isset($_GET["classroomID"])) { //get student count
    $classroomID = $_GET["classroomID"];

    $sql = "SELECT count(studentEmail) AS 'count' FROM studenttoclassroom WHERE classroomID = '$classroomID';";

    $count = -1;

    if ($result = $conn->query($sql)) { //query successful
        while ($row = $result->fetch_assoc()) {
            $count = $row['count'];
        }
        print $count;
    }
    else {  //fail: show error message
        echo "Error: " . $sql . "<br>" . $conn->error;
    }


}

closeConnection($conn);