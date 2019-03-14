<?php
session_start();
include_once "includes/head.inc.php";
include_once "includes/printSessionInfo.inc.php";
printHeadOpen('Dashboard');
printGoogleFontsCdn();
printJQueryCdn();
printBootstrapCssCdn();
printBootstrapJsCdn();
printFontAwesomeIconsCdn();

printSessionInfo(array('email', 'role'));

echo '
    <!--CUSTOM CSS-->
    <link href="css/dashboard.css" rel="stylesheet"/>
    <!--CUSTOM JS-->
    <script src="js/utils.js"></script>
    <script src="js/dashboard.js"></script>
';

printHeadClose();
?>

<main>
  <div class="container content-frame border rounded">
      <br>
      <div class="row align-items-start"><h1 id="dashboard-header" class="col">Dashboard</h1></div>
      <hr class="hr-header">
      <div class="div-dashboard">
          <div class="card">
              <div class="card-header">
                  <h2>Classrooms</h2>
              </div>
              <div id="cardBody" class="card-body">
              </div>
          </div>
      </div>
      <br>
  </div>
</main>

<?php
  require_once "includes/footer.inc.php";
?>
