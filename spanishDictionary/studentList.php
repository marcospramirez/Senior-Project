<?php
session_start();
include_once "includes/head.inc.php";
printHeadOpen('Student List');
printGoogleFontsCdn();
printBootstrapCssCdn();
printJQueryCdn();
printBootstrapJsCdn();
printDataTablesCdn();

include_once "includes/printSessionInfo.inc.php";
printSessionInfo(array('email', 'userType', 'classroomID', 'classroomName'));

echo '
    <!--CUSTOM CSS-->
    <link href="css/studentList.css" rel="stylesheet"/>
    <!--CUSTOM JS-->
    <script src="js/utils.js"></script>
    <script src="js/studentList.js"></script>
';

printHeadClose();
?>

    <div class="container">
        <div id="student-list-header" class="row align-items-start">
            <h1 id="classroom-name" class="col"></h1>
        </div>
        <div class="container student-list-frame border rounded">
            <br>
            <table id="table-student-list" class="table table-hover" style="width:100%"></table>
            <br>
        </div>
    </div>
