<?php
require_once("./db.php");

$conn = returnConnection();

if(isset($_GET["email"])) {  //if data in post, check user
    $email = $_GET["email"];

    if(isset($_GET["role"]) && $_GET["role"] == "student"){
        $sql = "SELECT classID, className, personalVocabID FROM Classroom, studentToClassroom WHERE studentToClassroom.studentEmail = '$email' and studentToClassroom.classroomID = Classroom.classID";
    }
    else{
        $sql = "SELECT className AS 'classrooms' FROM Classroom, Instructor WHERE instructorEmail = email AND email = '$email';";
    }

    $classroomString = '';

    if ($result = $conn->query($sql)) { //query successful

        if($_GET["role"] == "instructor"){
            while ($row = $result->fetch_assoc()) {
                $classroomString .= $row['classrooms']."||";
            }
            print $classroomString;
        }
        else{ //role is student, Marcos code here

            $records = array();
    
            if ($result->num_rows > 0){
                while($row = $result->fetch_assoc()){
                    $records[]=$row;
                    
                    //echo $row["entryText"];
                }
            }
    
            //echo json_encode($records);
            header('Content-Type: text/html; charset=utf-8');
            echo json_encode($records, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

        }

    }
    else {  //fail: show error message
        echo "Error: " . $sql . "<br>" . $conn->error;
    }
}//end of check if there is data in post

closeConnection($conn);