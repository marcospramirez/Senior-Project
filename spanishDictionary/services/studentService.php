<?php
    require_once("./db.php");
    require_once("./csvupload.php");

    $conn = returnConnection();


    $studentServiceAction = isset($_GET['Action']) ? $_GET['Action'] : "no action";

    switch ($studentServiceAction) {
        case "list":
            listAction($conn);
            break;

        case "count":
            countAction($conn);
            break;

        case "addStudentsCSV":
            addStudentCSV($conn);
            break;

        case "addStudents":
            addStudent($conn);
            break;

        case "no action":
            noAction($conn);
            break;

        // case "singleEdit":
        //     editStudent($conn);
        //     break;

        case "singleDelete":
            deleteStudentFromClass($conn);
            break;

        default:
            noAction();
            break;
    
    }

    closeConnection($conn);

    function listAction($conn){

        $classroomID = $_GET["classroomID"];

        $sql = "SELECT s.name, s.email FROM Classroom c, studentToClassroom t, Student s WHERE c.classID = t.classroomID AND t.studentEmail = s.email AND c.classID = $classroomID";

        $result = $conn->query($sql);
        
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

    function countAction($conn){

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

    function addStudentCSV($conn){
        $conn = returnConnection();
        $classID = $_POST['class'];

        $tmpName = $_FILES['csv']['tmp_name'];
        $csvAsArray = array_map('str_getcsv', file($tmpName));

       uploadStudents($conn, $classID, $csvAsArray);

    }

    function addStudent($conn){
        $classID = '';
        if(isset($_POST['class'])) {
            $classID = $_POST['class'];
        }

        if(isset($_POST['studentEmail'])) {
            $emails = $_POST['studentEmail'];
            foreach ($emails as $index => $email) { //add student
                $sql = "INSERT INTO Student (email, password, name) VALUES ('$email', NULL, NULL) ON DUPLICATE KEY UPDATE email=email;";

                if($conn->query($sql) === TRUE) {  //success: now add student to classroom
                    //$sql = "INSERT INTO studentToClassroom (studentEmail, classroomID) VALUES ('$email', '$classID');";

                    $createPersonalVocab = "INSERT INTO `PersonalVocabList` (`personalVocabID`) VALUES (NULL);";

                    $conn->query($createPersonalVocab);
                    $last_id = $conn->insert_id;


                    $sql = "INSERT into studentToClassroom (studentEmail, classroomID, personalVocabID) VALUES ('$email', '$classID', '$last_id')";
        

                    if($conn->query($sql) === TRUE) {   //success: go view students in classroom
                         header("Location: ../studentList.php");

                        // echo "SUCCESSFULLY INSERTED!!!";
                    } else {
                        echo "Error: " . $sql . "<br>" . $conn->error;
                    }
                } else {
                    echo "Error: " . $sql . "<br>" . $conn->error;
                }
            }

        } 

    }

    function noAction(){
        $retVal = array("error" => "no action error");

        echo json_encode($retVal);
    }

    // function editStudent($conn){
    //     try {
    //         $studentOldEmail = $_POST["studentOldEmail"];
    //         $studentNewEmail = $_POST["studentNewEmail"];

    //         $studentName = $_POST["studentName"];

    //         $updateStudentProfile = "UPDATE Student set email ='$studentNewEmail' and name = '$studentName' where email = '$studentOldEmail'";

    //         $updateQuestions = "UPDATE Question set questionEmail = '$studentNewEmail' where questionEmail = '$studentOldEmail'";

    //         $updateAnswers = "UPDATE Question set questionEmail = '$studentNewEmail' where questionEmail = '$studentOldEmail'";

    //         echo json_encode(array("msg" => "success"));

    //     } catch (Exception $e) {
    //         echo json_encode(array("error" => $e->getMessage()));
    //     }
    // }

    function deleteStudentFromClass($conn){
        try {
            $studentEmail = $_POST["studentEmail"];
            $classID = $_POST["classroomID"];


            $deleteStudentFromClass = "DELETE from studentToClassroom where classroomID = '$classID' and studentEmail = '$studentEmail'";

            $conn->query($deleteStudentFromClass);

            echo json_encode(array("msg" => "success"));

        } catch (Exception $e) {
            echo json_encode(array("error" => $e->getMessage()));
        }
    }


