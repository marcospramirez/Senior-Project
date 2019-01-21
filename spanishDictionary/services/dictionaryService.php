<?php
    require_once("./db.php");

    $dictionaryID = '';
    if(isset($_GET['dictionary'])) {
        $dictionaryID = $_GET['dictionary'];
    }
    
    $conn = returnConnection();

    //creating new dictionary
    if(isset($_POST["dictionaryName"])) {
        $classID = $_POST['class'];
        $dictionaryName = $_POST["dictionaryName"];

        $sql = "INSERT INTO Dictionary (dictionaryID, dictionaryName) VALUES (NULL, '$dictionaryName');";

        if ($conn->query($sql) === TRUE) {  //success: created new dictionary, now add dictionary to classroom
            $dictionaryID = $conn->insert_id;

            $sql = "INSERT INTO classroomToDictionary (classID, dictionaryID) VALUES ('$classID', '$dictionaryID');";

            if ($conn->query($sql) === TRUE) {  //success: added dictionary to classroom
                //if the new dictionary came with some entries,
                //then process new entries
                if(isset($_POST["entryText"])) {
                    $_POST["newEntry"] = 'true!';
                }
            }
        }
    }

    if(isset($_POST["newEntry"])){
        // echo count($_FILES);
        // echo '<pre>';
        // var_export($_FILES);
        // echo '</pre>';

        // foreach ($_FILES["entryAudio"]["name"] as $index => $value){
        //     echo $index . $value;
        // }

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
                    header("Location: ../dictionary.html?dictionaryID=" . $dictionaryID);
                }
            }
            else {
                echo "Error: " . $sql . "<br>" . $conn->error;
            }

        }
        
        // $entryText = $_POST["entryText"];
        // $entryDefinition = $_POST["entryDefinition"];
        // $entryAudio = basename($_FILES["entryAudio"]["name"]);
       
    }
    
    //else, just display the dictionary for the given dictionary id
    else{
    
    
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


    closeConnection($conn);
?>