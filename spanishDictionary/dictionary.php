<?php
session_start();
include_once "includes/head.inc.php";
printHeadOpen('Dictionary');
printGoogleFontsCdn();
printBootstrapCssCdn();
printJQueryCdn();
printBootstrapJsCdn();
printDataTablesCdn();
printFontAwesomeIconsCdn();

include_once "includes/printSessionInfo.inc.php";
printSessionInfo(array('role', 'dictionaryID', 'dictionaryName'));

echo '
    <!--CUSTOM JS-->
    <script src="js/utils.js"></script>
    <script src="js/dictionary.js"></script>
';

printHeadClose();
?>

<main>
    <div class="container content-frame border rounded">
        <br>
        <div class="row align-items-start">
            <h1 id="dictionary-header" class="col">Dictionary:</h1>
        </div>
        <hr class="hr-header">
        <div id="dictionary-body"></div>
        <table id="table-dictionary" class="table table-hover" style="width:100%">
            <thead>
            <tr>
                <th></th>
                <th>Term</th>
                <th>Definition</th>
            </tr>
            </thead>
        </table>
        <br>
    </div>
</main>

<?php
include_once "includes/footer.inc.php";
?>
