<?php
	require_once("./db.php");

	// if(isset($_POST["submit_csv"])){

	// 	$conn = returnConnection();
	// 	$classID = $_POST['class'];

	// 	$tmpName = $_FILES['csv']['tmp_name'];
	// 	$csvAsArray = array_map('str_getcsv', file($tmpName));

	// 	if($_POST["action"] === "studentcsv"){
	// 		uploadStudents($conn, $classID, $csvAsArray);

	// 	}
	// 	else if($_POST["action"] === "newDictionary"){
	// 		uploadNewDictionary($conn, $classID, $csvAsArray);
	// 	}

	// }

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
	               header("Location: ../studentList.php");
	            }
	            else{
	            	echo json_encode(array("error" => $conn->error));
	            }
	        } 
	        else {
	           echo json_encode(array("error" => $conn->error));
	        }   
        
		}
	}

	function uploadNewDictionary($conn, $classID, $csvAsArray){

		$dictionaryName = $_POST["dictionaryName"];

		$message = ["message" => "Success"];

		$insertSQL = "INSERT into Dictionary (dictionaryName) VALUES ('$dictionaryName')";


		if ($conn->query($insertSQL)) {
    		$dictID = $conn->insert_id;

    		$conn->query("INSERT into classRoomToDictionary (classID, dictionaryID) VALUES ('$dictID' , '$classID'");

			foreach ($csvAsArray as $index => $row) {
				$entry = $row[0];
				$entry = remove_utf8_bom($entry);

				$entryDef = $row[1];

				if($entry === "" || $entryDef ===""){
					$message["message"] = "Error, one of the entries was blank";
					break;
				}

				$entryAudio = $row[2];

				$entryTags = $row[3];

				$entryTagsArray = explode(",", $entryTags);

				$getTagsSQL = "SELECT tagID from Tag where tagText in (";

				foreach ($entryTagsArray as $entryTag) {
					$entryTag = trim($entryTag);

					$getTagsSQL .= "'$entryTag', ";
				}
				 
				$getTagsSQL .= "' ')";
	

				$insertNewEntry = "INSERT INTO Entry (entryText, entryDefinition, entryAudioPath) VALUES ('$entry', '$entryDef', '$entryAudio');";


	            if($conn->query($insertNewEntry)){
	                $last_id = $conn->insert_id;
		            //echo "New record created successfully. Last inserted ID is: " . $last_id;
		            
		            $addToDictionary = "INSERT INTO entryToDictionary (dictionaryID, entryID) VALUES ('$dictID', '$last_id');";
		            
		            if($conn->query($addToDictionary)){
		               
		               $foundTags = $conn->query($getTagsSQL);
		               
						$entryToTagInsertSQl = "INSERT INTO entryToTag (entryID, tagID) VALUES "; 


						$sqlArray = [];
		               if ($foundTags->num_rows > 0){
		                   while($row = $foundTags->fetch_assoc()){

		                   	$data = "('$last_id' , '" . $row["tagID"] ."')";

		                   	$sqlArray[] = $data;
		                   }

		                   $allTagsSql = implode(',' , $sqlArray);
							
							$entryToTagInsertSQl .= $allTagsSql;

		                   $conn->query($entryToTagInsertSQl);
		               }
		               
		            }
	            }
	            else{
	            	echo($conn->error);
	            }
	       
	        
			}
		session_start();
		$_SESSION["dictionaryName"] = $dictionaryName;
		$_SESSION["dictionaryID"] = $dictID;
		header("Location: ../dictionary.php");
		}
		else{
			echo json_encode(array("error" => $conn->error));
		}


	}

	function addToDictionaryFromFile($conn, $dictionaryID, $csvAsArray){

		foreach ($csvAsArray as $index => $row) {
			$entry = $row[0];
			$entry = remove_utf8_bom($entry);

			$entryDef = $row[1];

			if($entry === "" || $entryDef ===""){
				$message["message"] = "Error, one of the entries was blank";
				break;
			}

			$entryAudio = $row[2];

			$entryTags = $row[3];

			$entryTagsArray = explode(",", $entryTags);

			$getTagsSQL = "SELECT tagID from Tag where tagText in (";

			foreach ($entryTagsArray as $entryTag) {
				$entryTag = trim($entryTag);

				$getTagsSQL .= "'$entryTag', ";
			}
			 
			$getTagsSQL .= "' ')";


			$insertNewEntry = "INSERT INTO Entry (entryText, entryDefinition, entryAudioPath) VALUES ('$entry', '$entryDef', '$entryAudio');";


            if($conn->query($insertNewEntry)){
                $last_id = $conn->insert_id;
	            //echo "New record created successfully. Last inserted ID is: " . $last_id;
	            
	            $addToDictionary = "INSERT INTO entryToDictionary (dictionaryID, entryID) VALUES ('$dictionaryID', '$last_id');";
	            
	            if($conn->query($addToDictionary)){
	               
	               $foundTags = $conn->query($getTagsSQL);
	               
					$entryToTagInsertSQl = "INSERT INTO entryToTag (entryID, tagID) VALUES "; 


					$sqlArray = [];
	               if ($foundTags->num_rows > 0){
	                   while($row = $foundTags->fetch_assoc()){

	                   	$data = "('$last_id' , '" . $row["tagID"] ."')";

	                   	$sqlArray[] = $data;
	                   }

	                   $allTagsSql = implode(',' , $sqlArray);
						
						$entryToTagInsertSQl .= $allTagsSql;

	                   $conn->query($entryToTagInsertSQl);
	               }
	               
	            }
            }
            else{
            	echo json_encode(array("error" => $conn->error));
            }
       
        
		}
	}



?>
