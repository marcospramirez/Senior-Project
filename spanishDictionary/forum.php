<?php
session_start();
include_once "includes/head.inc.php";
include_once "includes/printSessionInfo.inc.php";
printHeadOpen('Forum');
printGoogleFontsCdn();
printBootstrapCssCdn();
printJQueryCdn();
printBootstrapJsCdn();
printMagicGridCdn();
printFontAwesomeIconsCdn();

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
    <div class="row align-items-start"><div id="forum-header" class="col"></div></div>
    <div style="justify-content: center;" class="row"><button title="Ask a Question" id="ask-question-btn" class="col-sm-auto btn dark" data-toggle="modal" data-target="#ask-question"><i class="fas fa-plus"></i> Ask a Question</button></div>
    <div class="row"><div id="error-message" class="col error-message"></div></div>
    <div id="forum" class="container"></div>
</main>

<!-- Ask a Question Modal -->
<div class="modal fade addToDict" id="ask-question" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered addToDict" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="modal-title">Ask a Question</h2>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            </div>
            <form id="ask-question-form" method="POST" enctype="multipart/form-data">
                <div class="modal-body">
                    <div style="text-align: center;"><div id="ask-question-error-message" class="error-message"></div></div>
                    <div class="form-group">
                        <label for="question-type-select" class="col-form-label"></label>
                        <select id="question-type-select" class="form-control custom-select question-type" title="Select a question type" name="questionType[]" onchange="displayQuestionInput()" required>
                            <option value="" selected disabled hidden>Select a question type</option>
                        </select>
                        <div id="ask-question-field" style="display: none;"></div>
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
<!-- End of Ask a Question Modal -->

<!-- Add a Question to Dictionary Modal -->
<div class="modal fade addToDict" id="add-to-dict" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered addToDict" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="modal-title">Add Question to Dictionary</h2>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            </div>
            <div id="add-to-dict-form">
                <div class="modal-body">
                    <div style="text-align: center;"><div id="add-to-dict-error-message" class="error-message"></div></div>
                    <div class="form-group">
                        <div id="select-dictionary-body">
                            <label id="dictionary-select-label" for="dictionary-select" class="col-form-label"></label>
                            <select id="dictionary-select" class="form-control custom-select" title="Select a Dictionary" name="dictionary" required>
                                <option value="" selected disabled hidden>Select a dictionary</option>
                            </select>
                        </div>
                        <div style="text-align: center;"><div id="add-to-dict-success-message" class="error-message"></div></div>
                        <div id="go-to-dict-btn" style="display: none; text-align: center;"><a class="btn dark" href="dictionary.php">View Dictionary</a></div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" id="submit-add-to-dict" class="btn dark">Add to Dictionary</button>
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- End of Add a Question to Dictionary Modal -->

<?php
include_once "includes/footer.inc.php";
?>
