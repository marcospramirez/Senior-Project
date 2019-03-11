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

  // if (!$conn->set_charset("utf8")) {
  //     printf("Error loading character set utf8: %s\n", $conn->error);
  // } else {
  //     printf("Current character set: %s\n", $conn->character_set_name());
  // }

  return $conn;
}

function closeConnection($conn){
	//mysqli_close($conn);
	$conn->close();
}
?>
