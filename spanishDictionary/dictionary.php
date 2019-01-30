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

<!-- Filter Dictionary Modal -->
<div class="modal fade filterDictionary" id="filter-dictionary" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered filterDictionary" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="modal-title">Filter</h2>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            </div>
            <form id="filter-dictionary-form" method="POST" enctype="multipart/form-data">
                <div class="modal-body">
                    <div id="filter-error-message"></div>
                    <div class="form-group">
                        <label for="dFilter" class="col-form-label">Filter Dictionary by Tag(s):</label>
                        <select id="dFilter tags-select" multiple="multiple" class="form-control tags" title="tags" name="filterTags[]" required></select>
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

<main>
    <div class="container content-frame border rounded">
        <br>
        <div class="row align-items-start">
            <h1 id="dictionary-header" class="col">Dictionary: </h1>
            <button id="filter-dictionary-btn" class="col-sm-auto btn dark" data-toggle="modal" data-target="#filter-dictionary">Filter</button>
        </div>
        <hr class="hr-header">
        <div id="dictionary-body" class="row align-items-start"></div>
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
