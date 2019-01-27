<?php
session_start();
include_once "includes/head.inc.php";
printHeadOpen('Dashboard');
printGoogleFontsCdn();
printJQueryCdn();
printBootstrapCssCdn();
printBootstrapJsCdn();

include_once "includes/printSessionInfo.inc.php";
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
      <h1 class="col">Gateway Dashboard</h1>
      <hr class="hr-header">
      <div class="div-dashboard">
          <div class="card">
              <div class="card-header">
                  <h2>Classrooms</h2>
              </div>
              <div class="card-body">
              </div>
              <div class="card-footer">
                  <button class="btn" onclick="window.location.href = '')">More...</button>
              </div>
          </div>
      </div>
      <br>
  </div>
</main>
</body>
</html>

<?php
  require_once "includes/footer.inc.php";
?>
