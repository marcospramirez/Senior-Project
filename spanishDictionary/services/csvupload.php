<?php
	require_once("./db.php");

	if(isset($_POST["submit_csv"])) {

		$conn = returnConnection();
		$classID = $_POST['classID'];

		$tmpName = $_FILES['csv']['tmp_name'];
		$csvAsArray = array_map('str_getcsv', file($tmpName));

		if($_POST["action"] === "studentcsv"){
			uploadStudents($conn, $classID, $csvAsArray);

		}
		else if($_POST["action"] === "newDictionary"){
			uploadNewDictionary($conn, $classID, $csvAsArray);
		}

	}

	function remove_utf8_bom($text)
	{
	    $bom = pack('H*','EFBBBF');
	    $text = preg_replace("/^$bom/", '', $text);
	    return $text;
	}

	function uploadStudents($conn, $classID, $csvAsArray){

		foreach ($csvAsArray as $index => $entry) {
			$email = $entry[0];

			$email = remove_utf8_bom($email);

			$insertSQL = "INSERT into Student (email, name, password) VALUES ('$email', null, null) ON DUPLICATE KEY UPDATE email=email";
			

			if ($conn->query($insertSQL) === TRUE) {

				$createPersonalVocab = "INSERT INTO `PersonalVocabList` (`personalVocabID`) VALUES (NULL);";

				$conn->query($createPersonalVocab);
				$last_id = $conn->insert_id;


				$studentToClassRoom = "INSERT into studentToClassroom (studentEmail, classroomID, personalVocabID) VALUES ('$email', '$classID', '$last_id')";
	    
	            if($conn->query($studentToClassRoom)){
	               echo "Success!";
	            }
	            else{
	            	echo($conn->error);
	            }
	        } 
	        else {
	            echo "Error: " . $insertSQL . "<br>" . $conn->error;
	        }   
        
		}
	}

	function uploadNewDictionary($conn, $classID, $csvAsArray){

		$dictionaryName = $_POST["dictionaryName"];

		$msg = ["msg" => "Success"];

		$insertSQL = "INSERT into Dictionary (dictionaryName) VALUES ('$dictionaryName')";


		if ($conn->query($insertSQL) === TRUE) {
    		$dictID = $conn->insert_id;

			foreach ($csvAsArray as $index => $row) {
				$entry = $row[0];
				$entry = remove_utf8_bom($entry);

				$entryDef = $row[1];

				if($entry === "" || $entryDef ===""){
					$msg["msg"] = "Error, one of the entries was blank";
					break;
				}

				$entryAudio = $row[2];

				$insertNewEntry = "INSERT INTO Entry (entryText, entryDefinition, entryAudioPath) VALUES ('$entry', '$entryDef', '$entryAudio');";

	            if($conn->query($insertNewEntry)){
	                $last_id = $conn->insert_id;
		            //echo "New record created successfully. Last inserted ID is: " . $last_id;
		            
		            $addToDictionary = "INSERT INTO entryToDictionary (dictionaryID, entryID) VALUES ('$dictID', '$last_id');";
		            
		            if($conn->query($addToDictionary)){
		                header("Location: ../dictionary.php?dictionaryID=" . $dictID);
		            }
	            }
	            else{
	            	echo($conn->error);
	            }
	       
	        
			}
		}
		else{
			echo "Error: " . $insertSQL . "<br>" . $conn->error;
		}

	}



?>
