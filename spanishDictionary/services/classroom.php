<?php
require_once("./db.php");

$conn = returnConnection();

if(isset($_GET["email"])) {  //if data in post, check user
    $email = $_GET["email"];
    $sql = "SELECT className AS 'classrooms' FROM Classroom, Instructor WHERE instructorEmail = email AND email = '$email';";

    $classroomString = '';

    if ($result = $conn->query($sql)) { //query successful
        while ($row = $result->fetch_assoc()) {
            $classroomString .= $row['classrooms']."||";
        }
        print $classroomString;
    }
    else {  //fail: show error message
        echo "Error: " . $sql . "<br>" . $conn->error;
    }
}//end of check if there is data in post

closeConnection($conn);