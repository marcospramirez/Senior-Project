<?php
  require "header.php";
?>

<main>
  <div class="container content-frame border rounded">
      <br>
      <h1 class="col">Gateway Dashboard</h1>
      <hr class="hr-header">
      <div class="div-dictionary">
        <form  action="dictionary.php" method="get">


        <?php
          require "./includes/dbh.inc.php";

          $sql = "SELECT * FROM Dictionary";
          $result = $conn->query($sql);
        
    
            if ($result->num_rows > 0){
                while($row = $result->fetch_assoc()){
                     $dictionaryID = $row['dictionaryID'];
                    print "<button type=\"submit\" class=\"btn btn-primary btn-block btn-dictionary text-left truncate\" name=\"dictionaryID\" value=$dictionaryID> Dictionary ";
                    print_r($dictionaryID);
                    print "</button>";
                }
            }
        
        ?>

        </form>
      </div>
      <br>
  </div>
</main>

<?php
  require "footer.php";
?>