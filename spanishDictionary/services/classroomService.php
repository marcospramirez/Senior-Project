<?php
    require_once("./db.php");

    $conn = returnConnection();

    $classroomServiceAction = isset($_GET['Action']) ? $_GET['Action'] : "no action";


    switch ($classroomServiceAction) {
        case "addClassroom":
            addClassroom($conn);
            break;

        case "deleteClassroom":
            deleteClassroom($conn);
            break;

        case "no action":
            noAction();
            break;

        default:
            noAction();
            break;
    
    }

    closeConnection($conn);


    function addClassroom($conn){
        try{
            if(isset($_POST['email'])) {
                $email = $_POST['email'];
            }

            if(isset($_POST['classroomName'])) {
                $names = $_POST['classroomName'];
                foreach ($names as $index => $name) {

                    $name = htmlentities($name);
                    $sql = "INSERT into Classroom (className, instructorEmail) VALUES ('$name', '$email')";

                    $conn->query($sql);
                   
                }
                 header("Location: ../dashboard.php");
                //echo json_encode(array("message" => "success"));

            } 
        }
        catch(Exception $e){
            echo json_encode(array("error" => $e->getMessage())); 
        }
       
    }

    function deleteClassroom($conn){
        try{

            $email = $_POST["email"];
            $classroomID= $_POST["class"];

            $getDictionaries = "SELECT Dictionary.dictionaryID from Dictionary, classroomToDictionary WHERE classroomToDictionary.classID = '$classroomID' and classroomToDictionary.dictionaryID = Dictionary.dictionaryID";

            $result = $conn->query($getDictionaries);
        
        
        
            if ($result->num_rows > 0){
                while($row = $result->fetch_assoc()){
                    $dictionaryID = $row["dictionaryID"];

                    $sql = "DELETE FROM Entry where Entry.entryID in (SELECT * from (SELECT Entry.entryID FROM Entry, entryToDictionary where entryToDictionary.dictionaryID = '$dictionaryID' and Entry.entryID = entryToDictionary.entryID) as T)";
            
                    $deleteDictionary = "DELETE FROM Dictionary where Dictionary.dictionaryID = '$dictionaryID' and Dictionary.dictionaryID in (SELECT dictionaryID from classroomToDictionary, Classroom where Classroom.instructorEmail = '$email' and Classroom.classID = classroomToDictionary.classID)";
                    
                    $conn->query($sql);

                    $conn->query($deleteDictionary);
                }
            }

            $deleteClassroomSql = "DELETE from Classroom where Classroom.classID = '$classroomID' and Classroom.instructorEmail = '$email'";

            if($conn->query($deleteClassroomSql)){
                echo json_encode(array("message" => "success"));
                //header("Location: ../dashboard.php");
            } 
            else{
                echo json_encode(array('error' => $conn->error));
            }

        }
        catch(Exception $e){
            echo json_encode(array('error' => $e->getMessage() ));
        }

    }

   function noAction(){
        $retVal = array("error" => "no action error");
        echo json_encode($retVal);
    }
?>
