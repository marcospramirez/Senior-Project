<?php
require_once("db.php");

$conn = returnConnection();

if(isset($_GET["classroomName"])) {  //if data in post, get student list
    $classroomName = $_GET["classroomName"];
    $sql = "SELECT s.name, s.email FROM Classroom c, studentToClassroom t, Student s WHERE c.classID = t.classroomID AND t.studentEmail = s.email AND c.className = '$classroomName';";

    $studentString = '';

    if ($result = $conn->query($sql)) { //query successful
        while ($row = $result->fetch_assoc()) {
            $studentString .= $row['name']."//";
            $studentString .= $row['email']."||";
        }
        print $studentString;
    }
}//end of check if there is data in post

closeConnection($conn);