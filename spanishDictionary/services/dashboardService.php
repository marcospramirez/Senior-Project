<?php
require_once("./db.php");

$conn = returnConnection();

if(isset($_GET["email"])) {  //if data in post, check user
    $email = $_GET["email"];

    if(isset($_GET["role"]) && $_GET["role"] == "student"){
        $sql = "SELECT classID, className, personalVocabID FROM Classroom, studentToClassroom WHERE studentToClassroom.studentEmail = '$email' and studentToClassroom.classroomID = Classroom.classID";
    }
    else{
        $sql = "SELECT classID, className FROM Classroom, Instructor WHERE instructorEmail = email AND email = '$email';";
    }

    if ($result = $conn->query($sql)) { //query successful

            $records = array();
    
            if ($result->num_rows > 0){
                while($row = $result->fetch_assoc()){
                    $records[]=$row;
                }
            }
    
            //echo json_encode($records);
            header('Content-Type: text/html; charset=utf-8');
            echo json_encode($records, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        

    }
    else {  //fail: show error message
        echo "Error: " . $sql . "<br>" . $conn->error;
    }
}//end of check if there is data in post

closeConnection($conn);



    // //get all of instructor's classrooms (name & id)
    // if(isset($_GET["email"])) {
    //     $email = $_GET["email"];
    //     $sql = "SELECT className AS 'name', classID AS 'id' FROM Classroom, Instructor WHERE instructorEmail = email AND email = '$email';";

    //     $classroomString = '';

    //     if ($result = $conn->query($sql)) { //query successful
    //         while ($row = $result->fetch_assoc()) {
    //             $classroomString .= $row['name']."||".$row['id']."``";
    //         }
    //         print $classroomString;
    //     }
    //     else {  //fail: show error message
    //         echo "Error: " . $sql . "<br>" . $conn->error;
    //     }
    // } elseif (isset($_GET["classID"])) {    //get className from classID
    //     $classID = $_GET["classID"];

    //     $sql = "SELECT className AS 'name' FROM Classroom WHERE classID = '$classID';";

    //     if ($result = $conn->query($sql)) { //query successful, return/print name
    //         while ($row = $result->fetch_assoc()) {
    //             print $row['name'];
    //         }
    //     }
    //     else {  //fail: show error message
    //         echo "Error: " . $sql . "<br>" . $conn->error;
    //     }
    // }