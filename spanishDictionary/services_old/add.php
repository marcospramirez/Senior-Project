<?php
if(isset($_POST['term'])) {//check that user came from dictionary page
  require 'db.php';

  //take term and definition from post
  $term = $_POST['term'];
  $definition = $_POST['definition'];

  $sql = "INSERT INTO Entry (entryText, entryDefinition, entryAudioPath) VALUES ('$term', '$definition', 'tempAudioPath');";
  $stmt = mysqli_stmt_init($conn);
  if (!mysqli_stmt_prepare($stmt, $sql)) {  //connection failed
    header("Location: ../index.php?error=sqlerror");
    exit();
  } else {  //no errors, check if hashed password in db is the same as newly hashed password
    mysqli_stmt_execute($stmt);
      $records = array();
    if ($result = mysqli_stmt_get_result($stmt)) { //true: there are results to display
        while ($row = mysqli_fetch_assoc($result)) { //display results
            $records[] = $row;
        }
    }
  }
} else { //user did not access page from dictionary page
  //redirect user back to dashboard
  header("Location: ../dictionary.php");
  exit();
} //end of else: user did not access page from dictionary page

?>
