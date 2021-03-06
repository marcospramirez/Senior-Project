<?php
session_start();
include_once "includes/head.inc.php";
include_once "includes/printSessionInfo.inc.php";
printHeadOpen('Quizzes');
printGoogleFontsCdn();
printBootstrapCssCdn();
printJQueryCdn();
printBootstrapJsCdn();
printDataTablesCdn();
printFontAwesomeIconsCdn();
printSelect2Cdn();


printSessionInfo(array('email', 'role', 'classroomID', 'classroomName'));

echo '
    <!--CUSTOM CSS-->
    <link href="css/quiz.css" rel="stylesheet"/>
    
    <!--CUSTOM JS-->
    <script src="js/utils.js"></script>
    <script src="js/quizzes.js"></script>
   
';

printHeadClose();
?>

<main class="container">
    <div id="form-holder" class="container content-frame border rounded">
        <form id="quiz-generation-form">
            <h1>Quiz Generator</h1>
            <div class="part1">
                <div id="error"></div>
                <h3>How should this quiz be generated?</h3>
                <input type="radio" id="dictionary" value="dictionary" name="quizType"><label for="dictionary">Dictionary</label>
                <input type="radio" id="personal-vocab-list" value="personal-vocab-list" name="quizType"><label for="personal-vocab-list">Personal Vocab List</label>
            </div>
            <div class="part2" style="display: none">
                <h3>All dictionaries or chooose your own?</h3>
                <input type="radio" id="alldictionaries" value="alldictionaries" name="dictionaryAmount" selected="selected"><label for="alldictionaries">All Dictionaries</label>
                <input type="radio" id="chooseOwn" value="chooseOwn" name="dictionaryAmount"><label for="chooseOwn">Choose your own</label>
            </div>
            <div class="part3" style="display: none">
                <h3>Choose Dictionaries</h3>
                <select id="dictionary-select" name="dictionarySelect[]" multiple="multiple">
                </select>
            </div>

            <div class="part4">
                <h3>Select tags (optional)</h3>
                <p>*Note: selecting tags may limit the number of entries that can be used to create a quiz and prevent one from being made</p>
                <select id="tags-select" name="tags" multiple="multiple">
                </select>
            </div>

             <input class="btn" type="submit" value="Generate Quiz">
        </form>

    </div>


    <div id="quizHolder" class="container content-frame border rounded" style="display: none"></div>
    <div id="gradedQuizHolder" class="container content-frame border rounded" style="display: none"></div>
</main>


<?php
include_once "includes/footer.inc.php";
?>
