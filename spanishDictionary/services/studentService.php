<?php
    require_once("./db.php");

    $classID = '';
    if(isset($_POST['class'])) {
        $classID = $_POST['class'];
    }

    $conn = returnConnection();

    //adding students to classroom
    if(isset($_POST['studentEmail'])) {
        $emails = $_POST['studentEmail'];
        foreach ($emails as $index => $email) { //add student
            $sql = "INSERT INTO student (email, password, name) VALUES ('$email', NULL, NULL);";

            if($conn->query($sql) === TRUE) {  //success: now add student to classroom
                $sql = "INSERT INTO studenttoclassroom (studentEmail, classroomID) VALUES ('$email', '$classID');";

                if($conn->query($sql) === TRUE) {   //success: go view students in classroom
//                    header("Location: ../dictionary.html?dictionaryID=" . $dictionaryID);
                    echo "SUCCESSFULLY INSERTED!!!";
                } else {
                    echo "Error: " . $sql . "<br>" . $conn->error;
                }
            } else {
                echo "Error: " . $sql . "<br>" . $conn->error;
            }
        }

    } elseif (isset($_GET['classID'])) {    //get all students in the class
        $classroomID = $_GET["classID"];
        $sql = "SELECT s.name, s.email FROM classroom c, studenttoclassroom t, student s WHERE c.classID = t.classroomID AND t.studentEmail = s.email AND c.classID = '$classroomID';";

        $studentString = '';

        if ($result = $conn->query($sql)) { //query successful
            while ($row = $result->fetch_assoc()) {
                $studentString .= $row['name']."//";
                $studentString .= $row['email']."||";
            }
            print $studentString;
        }
    }