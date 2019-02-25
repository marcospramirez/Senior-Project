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
   
';

printHeadClose();
?>

<main class="container">
    <div class="container content-frame border rounded">
        <form id="quiz-generation-form">
            <div class="part1">
                <h3>How should this quiz be generated?</h3>
                <input type="radio" id="dictionary"><label for="dictionary">Dictionary</label>
                <input type="radio" id="personal-vocab-list"><label for="personal-vocab-list">Personal Vocab List</label>
            </div>
            <div class="part2">
                <h3>All dictionaries or chooose your own?</h3>
                <input type="radio" id="alldictionaries"><label for="alldictionaries">All Dictionaries</label>
                <input type="radio" id="chooseOwn"><label for="chooseOwn">Choose your own</label>
            </div>
            <div class="part3">
                <h3>Choose Dictionaries</h3>
                <select id="dictionary-select" name="dictionary">
                </select>
            </div>

            <div class="part4">
                <select id="tags-select" name="tags" multiple="multiple">
                </select>
            </div>
        </form>
    </div>
</main>

<?php
include_once "includes/footer.inc.php";
?>
