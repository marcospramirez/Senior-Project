<?php
function returnConnection(){
	 $servername = "localhost";
  $dbusername = "mramircr_spanish";
  $dbpassword = "PKFuDD]p31h(";
  $dbname = "mramircr_spanishDictionary";

  // $servername = "localhost";
  // $dbusername = "root"; //default for xampp
  // $dbpassword = ""; //default for xampp
  // $dbname = "mramircr_spanishDictionary";

  $conn = new mysqli($servername, $dbusername, $dbpassword, $dbname);

  if($conn->connect_error){
      die("Connection failed: " . $conn->connect_error);
  }

  return $conn;
}

function closeConnection($conn){
	//mysqli_close($conn);
	$conn->close();
}
?>
