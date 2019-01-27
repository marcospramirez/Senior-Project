<?php
session_start();
include_once "includes/head.inc.php";
printHeadOpen('Classroom');
printGoogleFontsCdn();
printBootstrapCssCdn();
printJQueryCdn();
printBootstrapJsCdn();
printDataTablesCdn();
printFontAwesomeIconsCdn();

include_once "includes/printSessionInfo.inc.php";
printSessionInfo(array('email', 'role', 'classroomID', 'classroomName'));

echo '
    <!--CUSTOM CSS-->
    <link href="css/classroom.css" rel="stylesheet"/>
    <!--CUSTOM JS-->
    <script src="js/utils.js"></script>
    <script src="js/classroom.js"></script>
';

printHeadClose();
?>

<main>
    <div id="classroom-div" class="row align-items-start">
        <h1 id="classroom-header" class="col"></h1>
    </div>
    <div class="container content-frame border rounded">
        <br>
        <div id="table-header" class="row align-items-end">
            <div class="col"></div>
        </div>
        <br>
        <table id="table-dictionaries" class="table table-hover" style="width:100%"></table>
        <br>
    </div>
</main>

<?php
include_once "includes/footer.inc.php";
?>
