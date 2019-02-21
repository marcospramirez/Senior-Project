<?php
session_start();
include_once "includes/head.inc.php";
include_once "includes/printSessionInfo.inc.php";
printHeadOpen('Classroom');
printGoogleFontsCdn();
printBootstrapCssCdn();
printJQueryCdn();
printBootstrapJsCdn();
printDataTablesCdn();
printFontAwesomeIconsCdn();

printSessionInfo(array('email', 'role', 'classroomID', 'classroomName'));

echo '
    <!--CUSTOM JS-->
    <script src="js/utils.js"></script>
    <script src="js/classroom.js"></script>
';

printHeadClose();
?>

<main class="container">
    <div id="classroom-div" class="header row align-items-start">
        <h1 id="classroom-header" class="col"></h1>
        <a class="col-sm-auto btn dark" href="./forum.php">View Forum</a>
    </div>
    <div class="container content-frame border rounded">
        <br>
        <div id="table-header" class="row align-items-end">
            <div class="col"></div>
        </div>
        <br>
        <div id="table"><table id="table-dictionaries" class="table table-hover" style="width:100%"></table></div>
        <br>
    </div>
</main>

<?php
include_once "includes/footer.inc.php";
?>
