<?php
session_start();
include_once "includes/head.inc.php";
include_once "includes/printSessionInfo.inc.php";

//STUDENT ONLY PAGE - redirect if not student
if($_SESSION['role'] !== "student") {
    header("Location: index.php");
    exit();
}

printHeadOpen('Vocabulary List');
printGoogleFontsCdn();
printBootstrapCssCdn();
printJQueryCdn();
printJQueryColorCdn();
printBootstrapJsCdn();
printDataTablesCdn();
printFontAwesomeIconsCdn();
printSelect2Cdn();

printSessionInfo(array('email', 'role', 'classroomID', 'classroomName', 'personalVocabID'));

echo '
    <!--CUSTOM CSS-->
    <link href="css/dictionary.css" rel="stylesheet"/>
    <!--CUSTOM JS-->
    <script src="js/utils.js"></script>
    <script src="js/vocabList.js"></script>
    <script src="js/extendDictionary.js"></script>
';

printHeadClose();
?>

<main>
    <div class="container content-frame border rounded">
        <br>
        <div id="list-header" class="row align-items-start">
            <h1 id="list-name" class="col">Vocabulary List</h1>
            <a class="col-sm-auto btn dark" href="classroom.php">Add More</a>
<!--            <button id="filter-list-btn" class="col-sm-auto btn dark" data-toggle="modal" data-target="#filter-list">Filter</button>-->
        </div>
        <hr class="hr-header">
        <div id="list-body" class="row align-items-start"></div>
        <table id="table-list" class="table table-hover" style="width:100%"></table>
        <br>
    </div>
</main>

<!-- Filter Vocab List Modal -->
<div class="modal fade filterList" id="filter-list" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered filterList" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="modal-title">Filter Vocab List by Tag(s)</h2>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            </div>
            <form id="filter-list-form" method="POST" enctype="multipart/form-data">
                <div class="modal-body">
                    <div style="text-align: center;"><div id="filter-error-message" class="error-message"></div></div>
                    <div class="form-group">
                        <label for="tags-select" class="col-form-label">Filter Vocab List by Tag(s):</label>
                        <select id="tags-select" multiple="multiple" class="form-control tags" title="tags" name="filterTags[]" required></select>
                    </div>
                </div>
                <div class="modal-footer">
                    <input type="submit" name="submit_filter" value="Filter" class="btn dark">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                </div>
            </form>
        </div>
    </div>
</div>
<!-- End Filter Dictionary Modal -->


<!-- Delete Term Modal -->
<div class="modal fade deleteTerm" id="delete-term" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered deleteTerm" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="modal-title">Delete Term from Vocab List</h2>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            </div>
            <div class="modal-body">
                <div style="text-align: center;"><div id="delete-error-message" class="error-message"></div></div>
                <p>Are you sure you want to delete term "<span id="deleting-term" style="font-weight: bold"></span>" from your Vocab List?</p>
            </div>
            <div class="modal-footer">
                <button type="button" id="submit-delete-term" class="btn dark">Delete</button>
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            </div>
        </div>
    </div>
</div>
<!-- End Delete Term Modal -->

<?php
include_once "includes/footer.inc.php";
?>
