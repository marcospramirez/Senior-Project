<?php
    require_once("./db.php");

    $conn = returnConnection();


    $personalVocabListAction = isset($_GET['Action']) ? $_GET['Action'] : "no action";

    switch ($personalVocabListAction) {
        case "single":
            singleAction($conn);
            break;

        case "addToVocabList":
            addToVocabList($conn);
            break;

        case "removeFromVocabList":
            removeFromVocabList($conn);
            break;

        case "no action":
            noAction($conn);
            break;

        default:
            noDictionaryAction();
            break;
    
    }

    closeConnection($conn);

    function noAction(){

        $retVal = array("error" => "no action error");

        echo json_encode($retVal);

    }

    function singleAction($conn){

        try{
            
            $classroomID = $_GET["classroomID"];
            $studentEmail = $_GET["email"];

            $sql = "SELECT * FROM Entry where entryID in (SELECT entryID from entryToPersonalVocabList, studentToClassroom where studentToClassroom.studentEmail = '$studentEmail' and studentToClassroom.classroomID = '$classroomID' and entryToPersonalVocabList.personalVocabID = studentToClassroom.personalVocabID)"; 

            $result = $conn->query($sql);
        
            $records = array();
            
            if ($result->num_rows > 0){
                while($row = $result->fetch_assoc()){
                    $records[]=$row;
                    
                }
            }

            header('Content-Type: text/html; charset=utf-8');
            echo json_encode($records, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

        } catch (Exception $e) {
            echo json_encode(array("error" => $e->getMessage()));
        }
    }

    function addToVocabList($conn){

        try {
            $classroomID = $_POST["classroomID"];
            $studentEmail = $_POST["email"];
            $entryID = $_POST["entryID"];

            $sql = "INSERT into entryToPersonalVocabList (entryID, personalVocabID) values ('$entryID', (SELECT personalVocabID from studentToClassroom where studentToClassroom.studentEmail = '$studentEmail' and studentToClassroom.classroomID = '$classroomID'))";

            $result = $conn->query($sql);

            echo json_encode(array("message" => "success"));

        } catch (Exception $e) {
            echo json_encode(array("error" => $e->getMessage()));
        }

    }

    function removeFromVocabList($conn){
        try {
            
            $classroomID = $_POST["classroomID"];
            $studentEmail = $_POST["email"];
            $entryID = $_POST["entryID"];

            $sql = "DELETE FROM entryToPersonalVocabList WHERE entryID = '$entryID' and personalVocabID = (SELECT personalVocabID from studentToClassroom where studentToClassroom.studentEmail = '$studentEmail' and studentToClassroom.classroomID = '$classroomID')";

            $result = $conn->query($sql);

            echo json_encode(array("message" => "success"));


        } catch (Exception $e) {
            echo json_encode(array("error" => $e->getMessage()));
        }

    }

?>


    