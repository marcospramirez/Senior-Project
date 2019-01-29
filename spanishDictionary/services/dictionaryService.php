<?php
    require_once("./db.php");
    require_once("./csvupload.php");

    $conn = returnConnection();


    $dictionaryServiceAction = isset($_GET['Action']) ? $_GET['Action'] : "no action";

    switch ($dictionaryServiceAction) {
        case "list":
            listAction($conn);
            break;

        case "single":
            singleAction($conn);
            break;

        case "addDictionaryCSV":
            addDictionaryCSV($conn);
            break;

        case "addDictionary":
            addDictionary($conn);
            break;

        case "no action":
            noDictionaryAction($conn);
            break;

        case "tags":
            getAllTags($conn);
            break;

        case "filter":
            getEntriesInDictionaryByTags($conn);
            break;

        default:
            noDictionaryAction();
            break;
    
    }

    closeConnection($conn);

    //pre: $_GET["classroomID"] = valid classroom id
    //post: returns list of dictionaries for given classroom id
    function listAction($conn){

        $classroomID = $_GET["classroomID"];

        $sql = "SELECT Dictionary.dictionaryID, Dictionary.dictionaryName from Dictionary, classroomToDictionary WHERE classroomToDictionary.classID = '$classroomID' and classroomToDictionary.dictionaryID = Dictionary.dictionaryID";

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

    //pre: $_GET["dictionary"] == valid dictionaryID
    //post: returns entry data for specific dictionary by dictionary id
    function singleAction($conn){

        $dictionaryID;
        if(isset($_GET['dictionaryID'])) {
            $dictionaryID = $_GET['dictionaryID'];
        }
    

        $sql = "SELECT Entry.entryText, Entry.entryDefinition, Entry.entryAudioPath, dictionaryID FROM Entry INNER JOIN entryToDictionary USING (entryID) where dictionaryID = '$dictionaryID'";
    
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


    function addDictionaryCSV($conn){
        $conn = returnConnection();
        $classID = $_POST['class'];

        $tmpName = $_FILES['csv']['tmp_name'];
        $csvAsArray = array_map('str_getcsv', file($tmpName));

        uploadNewDictionary($conn, $classID, $csvAsArray);

    }


    function addDictionary($conn){

        if(isset($_POST["dictionaryName"])) {
            //echo("Step 1");
            $classID = $_POST['class'];
            $dictionaryName = $_POST["dictionaryName"];

            $sql = "INSERT INTO Dictionary (dictionaryID, dictionaryName) VALUES (NULL, '$dictionaryName');";

            if ($conn->query($sql) === TRUE) {  //success: created new dictionary, now add dictionary to classroom
                $dictionaryID = $conn->insert_id;
//echo("Step 2");
                $sql = "INSERT INTO classroomToDictionary (classID, dictionaryID) VALUES ('$classID', '$dictionaryID');";

                if ($conn->query($sql) === TRUE) {  //success: added dictionary to classroom
                    //if the new dictionary came with some entries,
                    //then process new entries
                    //echo("Step 3");
                    if(isset($_POST["entryText"])) {
                        $entry = $_POST["entryText"];
                        foreach ($entry as $index => $entryText) {
                            $entryDefinition = $_POST["entryDefinition"][$index];
                            $entryAudio = basename($_FILES["entryAudio"]["name"][$index]);

                            $target_dir = "../audio/";
                            $target_file = $target_dir . $entryAudio;

                            move_uploaded_file($_FILES["entryAudio"]["tmp_name"][$index], $target_file);
                            $sql = "INSERT INTO Entry (entryText, entryDefinition, entryAudioPath) VALUES ('$entryText', '$entryDefinition', '$entryAudio');";


                            if ($conn->query($sql) === TRUE) {
                                $last_id = $conn->insert_id;
                                //echo "New record created successfully. Last inserted ID is: " . $last_id;

                                $addToDictionary = "INSERT INTO entryToDictionary (dictionaryID, entryID) VALUES ('$dictionaryID', '$last_id');";

                                if($conn->query($addToDictionary)){
                                    session_start();
                                    $_SESSION["dictionaryID"] = $dictionaryID;
                                    header("Location: ../dictionary.php");
                                }
                            }
                            else {
                                echo "Error: " . $sql . "<br>" . $conn->error;
                            }

                        }
                    }
                }
            }
        }

    }

    function noDictionaryAction(){

        $retVal = array("error" => "no action error");

        echo json_encode($retVal);

    }

    function getAllTags($conn){
        $sql = "SELECT * from Tag";
        $result = $conn->query($sql);
        
        $response = array();

        $results = [];
      
        
        if ($result->num_rows > 0){
            while($row = $result->fetch_assoc()){

                $record = array("id" => $row["tagID"], "text" => $row["tagText"]);
                $results[]= $record;

            }
        }

        $response["results"] = $results;
    
        header('Content-Type: text/html; charset=utf-8');
        echo json_encode($response, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

    }

    function getEntriesInDictionaryByTags($conn){
        $dictionaryID;
        $tags;

        if(isset($_GET['dictionary'])) {
            $dictionaryID = $_GET['dictionary'];
        }
        if(isset($_GET['tags'])){
            $tags = $_GET['tags'];
        }
    
        //SELECT Entry.entryText, Entry.entryDefinition, Entry.entryAudioPath, dictionaryID FROM Entry INNER JOIN entryToDictionary USING (entryID) where dictionaryID = 36 and entryID in (SELECT entryID from entryToTag where tagID in (1,2))

        $sql = "SELECT Entry.entryText, Entry.entryDefinition, Entry.entryAudioPath, dictionaryID FROM Entry INNER JOIN entryToDictionary USING (entryID) where dictionaryID = '$dictionaryID' and entryID in (SELECT entryID from entryToTag where tagID in ($tags))";
    
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

    
?>