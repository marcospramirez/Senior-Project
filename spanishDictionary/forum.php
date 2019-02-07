<?php
session_start();
include_once "includes/head.inc.php";
printHeadOpen('Forum');
printGoogleFontsCdn();
printBootstrapCssCdn();
printJQueryCdn();
printBootstrapJsCdn();
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

<!-- Add a Question Modal -->
<div class="modal fade askQuestion" id="ask-question" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered askQuestion" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="modal-title">Ask a Question</h2>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            </div>
            <form id="ask-question-form" method="POST" enctype="multipart/form-data">
                <div class="modal-body">
                    <div style="text-align: center;"><div id="ask-question-error-message"></div></div>
                    <div class="form-group">
                        <select id="question-type-select" class="form-control custom-select question-type" title="questionType" name="questionType[]" onchange="displayQuestionInput()" required>
                            <option value="" selected disabled hidden>Select a question type</option>
                            <option value="1">Como se dice "___" en espanol?</option>
                            <option value="2">Que significa "___" en ingles?</option>
                            <option value="3">Other</option>
                        </select>
                        <div id="ask-question-field"></div>
                    </div>
                </div>
                <div class="modal-footer">
                    <input type="submit" name="submit_question" value="Ask Question" class="btn dark">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                </div>
            </form>
        </div>
    </div>
</div>
<!-- End of Add a Question Modal -->

<main class="container">
    <div class="row align-items-start"><div id="forum-header" class="col"></div></div>
    <div style="justify-content: center;" class="row"><button id="ask-question-btn" class="col-sm-auto btn dark" data-toggle="modal" data-target="#ask-question"><i class="fas fa-plus"></i> Ask a Question</button></div>
    <div id="forum" class="container"></div>
</main>

<?php
include_once "includes/footer.inc.php";
?>
