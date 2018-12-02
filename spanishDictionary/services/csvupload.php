<?php
	require_once("./db.php");


	if(isset($_POST["submit_csv"])){

		$conn = returnConnection();
		$classID = $_POST['classId'];

		$tmpName = $_FILES['csv']['tmp_name'];
		$csvAsArray = array_map('str_getcsv', file($tmpName));

		foreach ($csvAsArray as $index => $entry) {
			$email = $entry[0];

			$email = remove_utf8_bom($email);

			$insertSQL = "INSERT into Student (email, name, password) VALUES ('$email', null, null) ON DUPLICATE KEY UPDATE email=email";
			$studentToClassRoom = "INSERT into studentToClassroom (studentEmail, classroomID) VALUES ('$email', '$classID')";

			if ($conn->query($insertSQL) === TRUE) {
	    
	            if($conn->query($studentToClassRoom)){
	               echo "Success!";
	            }
	            else{
	            	echo($conn->error);
	            }
	        } 
	        else {
	            echo "Error: " . $sql . "<br>" . $conn->error;  
	        }   
        
		}
	}

	function remove_utf8_bom($text)
	{
	    $bom = pack('H*','EFBBBF');
	    $text = preg_replace("/^$bom/", '', $text);
	    return $text;
	}


?>
