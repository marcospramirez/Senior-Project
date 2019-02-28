<?php
session_start();
include_once "includes/head.inc.php";
include_once "includes/printSessionInfo.inc.php";
printHeadOpen('Dictionary');
printGoogleFontsCdn();
printBootstrapCssCdn();
printJQueryCdn();
printJQueryColorCdn();
printBootstrapJsCdn();
printDataTablesCdn();
printFontAwesomeIconsCdn();
printSelect2Cdn();

printSessionInfo(array('role', 'dictionaryID', 'dictionaryName'));

echo '
    <!--CUSTOM CSS-->
    <link href="css/dictionary.css" rel="stylesheet"/>
    <!--CUSTOM JS-->
    <script src="js/utils.js"></script>
    <script src="js/dictionary.js"></script>
    <script src="js/extendDictionary.js"></script>
';

printHeadClose();
?>

<main>
    <div class="container content-frame border rounded">
        <br>
        <div id="dictionary-header" class="row align-items-start">
            <h1 id="dictionary-name" class="col">Dictionary: </h1>
            <div id="add-more"></div>
            <button id="filter-dictionary-btn" class="col-sm-auto btn dark" data-toggle="modal" data-target="#filter-dictionary">Filter</button>
        </div>
        <hr class="hr-header">
        <div id="dictionary-body" class="row align-items-start"></div>
        <table id="table-dictionary" class="table table-hover" style="width:100%"></table>
        <br>
    </div>
</main>

<!-- Filter Dictionary Modal -->
<div class="modal fade filterDictionary" id="filter-dictionary" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered filterDictionary" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="modal-title">Filter Dictionary by Tag(s)</h2>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            </div>
            <form id="filter-dictionary-form" method="POST" enctype="multipart/form-data">
                <div class="modal-body">
                    <div style="text-align: center;"><div id="filter-error-message" class="error-message"></div></div>
                    <div class="form-group">
                        <label for="tags-select" class="col-form-label">Filter Dictionary by Tag(s):</label>
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

<!-- Edit Term Modal -->
<div class="modal fade editTerm" id="edit-term" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered editTerm" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="modal-title">Edit Term</h2>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            </div>
            <form id="edit-term-form" name="editTermForm">
                <div class="modal-body">
                    <div style="text-align: center;"><div id="edit-error-message" class="error-message"></div></div>
                    <div class="form-group">
                        <label for="entryText" class="col-form-label">Edit Term:</label>
                        <input type="text" class="form-control" id="entryText" name="eText">
                    </div>
                    <div class="form-group">
                        <label for="entryDef" class="col-form-label">Edit Definition:</label>
                        <input type="text" class="form-control" id="entryDef" name="eDefinition">
                    </div>
                    <div class="form-group">
                        <label for="edit-tags" class="col-form-label">Edit Tag(s):</label>
                        <select id="edit-tags" multiple="multiple" class="form-control tags" title="tags" name="editTags[]"></select>
                    </div>
                    <div class="form-group">
                        <label for="entryAudio" class="col-form-label">Edit Audio:</label>
                        <input type="file" class="form-control" id="entryAudio" accept="audio/*" name="entryAudio">
                    </div>
                </div>
                <div class="modal-footer">
                    <input type="submit" name="submit_edit" value="Edit" class="btn dark">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                </div>
            </form>
        </div>
    </div>
</div>
<!-- End Edit Term Modal -->

<!-- Delete Term Modal -->
<div class="modal fade deleteTerm" id="delete-term" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered deleteTerm" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="modal-title">Delete Term from Dictionary</h2>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            </div>
            <div class="modal-body">
                <div style="text-align: center;"><div id="delete-error-message" class="error-message"></div></div>
                <p>Are you sure you want to delete term "<span id="deleting-term" style="font-weight: bold"></span>" from the dictionary?</p>
            </div>
            <div class="modal-footer">
                <button type="button" id="submit-delete" class="btn dark">Delete</button>
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            </div>
        </div>
    </div>
</div>
<!-- End Delete Term Modal -->

<?php
include_once "includes/footer.inc.php";
?>
