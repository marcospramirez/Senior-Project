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
    <script src="js/classroom.js"></script>
';

printHeadClose();
?>

<main class="container">
    <div id="classroom-div" class="header row align-items-start">
        <h1 id="classroom-header" class="col"></h1>
        <?php if($_SESSION['role'] == 'instructor') echo '<button id="add-default-dict-btn" class="col-sm-auto btn dark" data-toggle="modal" data-target="#add-default-dict">Add Default Dictionary</button>'?>
        <a class="col-sm-auto btn dark" href="forum.php">View Forum</a>
        <div id="set-btn"><a class="col-sm-auto btn dark" href="#"> Loading... </a></div>
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

<!-- Add Built-in Dictionary to Classroom Modal -->
<div class="modal fade addDefaultDict" id="add-default-dict" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered addDefaultDict" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="modal-title">Add Default Dictionary to Classroom</h2>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            </div>
            <div id="add-default-dict-form">
                <div class="modal-body">
                    <div style="text-align: center;"><div id="add-default-dict-error-message" class="error-message"></div></div>
                    <div class="form-group">
                        <div id="select-dictionary-body">
                            <label id="dictionary-select-label" for="dictionary-select" class="col-form-label"></label>
                            <select id="dictionary-select" class="form-control custom-select" title="Select a Dictionary" name="dictionary" required>
                                <option value="" selected disabled hidden>Select a dictionary</option>
                            </select>
                        </div>
                        <div style="text-align: center;"><div id="add-default-dict-success-message" class="error-message"></div></div>
                        <div id="go-to-dict-btn" style="display: none; text-align: center;"><a class="btn dark" href="dictionary.php">View Dictionary</a></div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" id="submit-add-dict" class="btn dark" onclick="addDefaultDictionaryToClassroom(classroomIDFromSession)">Add Dictionary</button>
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- End of Add Built-in Dictionary to Classroom Modal -->

<?php
include_once "includes/footer.inc.php";
?>
