<?php
    require_once("./db.php");

    $conn = returnConnection();

    //get all of instructor's classrooms (name & id)
    if(isset($_GET["email"])) {
        $email = $_GET["email"];
        $sql = "SELECT className AS 'name', classID AS 'id' FROM Classroom, Instructor WHERE instructorEmail = email AND email = '$email';";

        $classroomString = '';

        if ($result = $conn->query($sql)) { //query successful
            while ($row = $result->fetch_assoc()) {
                $classroomString .= $row['name']."||".$row['id']."``";
            }
            print $classroomString;
        }
        else {  //fail: show error message
            echo "Error: " . $sql . "<br>" . $conn->error;
        }
    } elseif (isset($_GET["classID"])) {    //get className from classID
        $classID = $_GET["classID"];

        $sql = "SELECT className AS 'name' FROM classroom WHERE classID = '$classID';";

        if ($result = $conn->query($sql)) { //query successful, return/print name
            while ($row = $result->fetch_assoc()) {
                print $row['name'];
            }
        }
        else {  //fail: show error message
            echo "Error: " . $sql . "<br>" . $conn->error;
        }
    }

    closeConnection($conn);