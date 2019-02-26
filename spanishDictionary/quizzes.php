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
printSelect2Cdn();


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
                <input type="radio" id="dictionary" value="dictionary" name="quizType"><label for="dictionary">Dictionary</label>
                <input type="radio" id="personal-vocab-list" value="personal-vocab-list" name="quizType"><label for="personal-vocab-list">Personal Vocab List</label>
            </div>
            <div class="part2">
                <h3>All dictionaries or chooose your own?</h3>
                <input type="radio" id="alldictionaries" value="alldictionaries" name="dictionaryAmount"><label for="alldictionaries">All Dictionaries</label>
                <input type="radio" id="chooseOwn" value="chooseOwn" name="dictionaryAmount"><label for="chooseOwn">Choose your own</label>
            </div>
            <div class="part3">
                <h3>Choose Dictionaries</h3>
                <select id="dictionary-select" name="dictionarySelect">
                </select>
            </div>

            <div class="part4">
                <select id="tags-select" name="tags" multiple="multiple">
                </select>
            </div>
        </form>
    </div>
</main>

<script type="text/javascript">
    $(document).ready(function(){


        $("#tags-select").select2({
            ajax: {
                url: 'services/dictionaryService.php?Action=tags',
                dataType: 'json'
            },
            placeholder: 'Tags',
            width: '100%'
        });

        $("#dictionary-select").select2({
            ajax: {
                url: 'services/dictionaryService.php?Action=dictionarySelect&classroomID=' + classroomIDFromSession,
                dataType: 'json'
            },
            placeholder: 'Dictionaries',
            width: '100%'
        });
    });

</script>

<?php
include_once "includes/footer.inc.php";
?>
