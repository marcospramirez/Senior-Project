<?php
session_start();
include_once "includes/head.inc.php";
printHeadOpen('Forum');
printGoogleFontsCdn();
printBootstrapCssCdn();
printJQueryCdn();
printMagicGridCdn();
printFontAwesomeIconsCdn();

include_once "includes/printSessionInfo.inc.php";
printSessionInfo(array('email', 'role', 'classroomID', 'classroomName'));

echo '
    <!--CUSTOM CSS-->
    <link href="css/forum.css" rel="stylesheet"/>
    <!--CUSTOM JS-->
    <script src="js/utils.js"></script>
    <script src="js/forum.js"></script>
';

printHeadClose();
?>

<main class="container">
    <div id="forum-header"><h1>SPAN 2350-02 Forum</h1></div>
    <div id="forum" class="container">
    </div>
</main>

<?php
include_once "includes/footer.inc.php";
?>
