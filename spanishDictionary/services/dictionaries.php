<?php
require_once("db.php");

$conn = returnConnection();

if(isset($_GET["role"]) && $_GET["role"] == "instructor"){
    if(isset($_GET["email"])) {  //

        
            $email = $_GET["email"];
            //get all dictionary names for specific user
            $sql = "SELECT d.dictionaryName AS 'name', d.dictionaryID AS 'id' FROM Instructor i, Classroom c, classroomToDictionary t, Dictionary d WHERE i.email = '$email' AND i.email = c.instructorEmail AND c.classID = t.classID AND t.dictionaryID = d.dictionaryID;";

            $dictionaryString = '';

            if ($result = $conn->query($sql)) { //query successful
                while ($row = $result->fetch_assoc()) {
                    $dictionaryString .=  $row['name']."||".$row['id']."``";
                }
                print $dictionaryString;
            }
            else {  //fail: show error message
                echo "Error: " . $sql . "<br>" . $conn->error;
            }   
        
        
    }//end of check if there is data in post
    elseif(isset($_GET["classroomID"])) { //get student count
        $classroomID = $_GET["classroomID"];

        $sql = "SELECT count(studentEmail) AS 'count' FROM studentToClassroom WHERE classroomID = '$classroomID';";

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
}
else{ // role is student

    if(isset($_GET["email"])) {  //

        
            $email = $_GET["email"];
            //get all dictionary names for specific user
            $sql = "SELECT d.dictionaryName AS 'name' FROM Instructor i, Classroom c, classroomToDictionary t, Dictionary d WHERE i.email = '$email' AND i.email = c.instructorEmail AND c.classID = t.classID AND t.dictionaryID = d.dictionaryID;";

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

        $sql = "SELECT Dictionary.dictionaryName, Dictionary.dictionaryID from Dictionary, classroomToDictionary WHERE classroomToDictionary.classID = '$classroomID' and classroomToDictionary.dictionaryID = Dictionary.dictionaryID";

        $count = -1;

        if ($result = $conn->query($sql)) { //query successful
            while ($row = $result->fetch_assoc()) {
               $dictionaryString .=  $row['name']."||";
            }
            print $dictionaryString;
        }
        else {  //fail: show error message
            echo "Error: " . $sql . "<br>" . $conn->error;
        }


    }

}

closeConnection($conn);