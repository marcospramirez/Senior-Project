<?php
session_start();
include_once "includes/head.inc.php";
include_once "includes/printSessionInfo.inc.php";

//INSTRUCTOR ONLY PAGE - redirect if not instructor
if($_SESSION['role'] !== "instructor") {
    header("Location: index.php");
    exit();
}

$dictionaryFlag = getAddDictionaryFlag();
$csvAction = '';
$normalAction = '';
$pageTitle = '';
$sessionInfo = array();
if($dictionaryFlag == "newDictionary") {
    $csvAction = 'addDictionaryCSV';
    $normalAction = 'addDictionary';
    $pageTitle = 'Add Dictionary';
    array_push($sessionInfo, 'email', 'role', 'classroomID', 'classroomName', 'addDictionaryFlag');
}
else if($dictionaryFlag == "populatedDictionary") {
    $csvAction = 'addToDictionaryCSV';
    $normalAction = 'addToDictionary';
    $pageTitle = 'Add To Dictionary';
    array_push($sessionInfo, 'email', 'role', 'classroomID', 'classroomName', 'dictionaryID', 'dictionaryName', 'addDictionaryFlag');
}
else {  //dictionaryFlag is wrong, redirect back to dictionary to try again
    header("Location: dictionary.php");
    exit();
}

printHeadOpen($pageTitle);
printGoogleFontsCdn();
printBootstrapCssCdn();
printJQueryCdn();
printBootstrapJsCdn();
printFontAwesomeIconsCdn();
printSelect2Cdn();

printSessionInfo($sessionInfo);

echo '
    <!--CUSTOM CSS-->
    <link href="css/add.css" rel="stylesheet"/>
    <!--CUSTOM JS-->
    <script src="js/utils.js"></script>
    <script src="js/addDictionary.js"></script>

';

printHeadClose();
?>

    <!-- Import Dictionary Modal -->
    <div class="modal fade importFile" id="import-file" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered importFile" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h2 class="modal-title">Import Dictionary</h2>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <form id="import-dictionary-form" action="services/dictionaryService.php?Action=<?php echo $csvAction;?>" method="POST" enctype="multipart/form-data">
                    <div class="modal-body">
                        <div id="import-error-message"></div>
                        <div id="dict-name-csv" class="form-group">
                            <label for="dName" class="col-form-label">Dictionary Name:</label>
                            <input type="text" class="form-control" id="dName" required name="dictionaryName">
                        </div>
                        <div class="form-group">
                            <label for="importFile" class="col-form-label">Import from csv:</label>
                            <input type="file" id="importFile" class="form-control" accept=".csv" name="csv" required>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <input type="submit" name="submit_csv" value="Import Dictionary" class="btn dark">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <main>
        <div class="container content-frame border rounded">
            <br>
            <div class="row align-items-start">
                <h1 id="add-dict-header" class="col"></h1>
                <button id="add-import" class="col-sm-auto btn dark" data-toggle="modal" data-target="#import-file">Import Dictionary</button>
            </div>
            <hr class="hr-header">
            <form id="new-dictionary-form" enctype="multipart/form-data" action="services/dictionaryService.php?Action=<?php echo $normalAction;?>" method="POST">
                <!--Dictionary Name-->
                <div id="dict-name" class="row align-items-start">
                    <div class="col-sm-auto"><input type="text" id="dictionary-name" class="form-control" title="dictionary" name="dictionaryName" placeholder="Dictionary Name" required></div>
                </div>
                <div id="terms">
                    <div id="term1" class="row align-items-start"> <!--Term #1 in Dictionary-->
                        <div class="col-sm-auto"> <!--Term & Audio-->
                            <div class="row align-items-start"> <!--Term-->
                                <div class="form-group col"><input type="text" class="form-control" title="term" name="entryText[]" placeholder="Term" required></div>
                            </div>
                            <div class="row align-items-start"> <!--Audio File-->
                                <div class="form-group col"><input type="file" class="form-control" accept="audio/*" name="entryAudio[]"></div>
                            </div>
                        </div>
                        <div class="col"> <!--Definition & Tags-->
                            <div class="row align-items-start"> <!--Definition-->
                                <div class="form-group col"><textarea class="form-control" title="definition" name="entryDefinition[]" placeholder="Definition" required></textarea>
                                </div>
                            </div>
                            <div class="row align-items-start"> <!--Tags-->
                                <div class="form-group col"><select id="tags-select" multiple="multiple" class="form-control tags" title="tags" name="entryTags[0][]"></select></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row"> <!--Button: Add New Term text fields-->
                    <div class="col" align="right"><button type="button" class="btn add-more" onclick="addTermFields()"><i class="fas fa-plus"></i></button></div>
                </div>
                <div id="add-dictionary-error-message"></div>
                <div class="row"> <!--Button: Create New Dictionary-->
                    <div id="add-dictionary-hidden"></div>  <!--add classID into POST-->
                    <div class="col" align="center"><input type="submit" name="newDictionary" value="Create Dictionary" id="submit-new" class="btn dark"></div>
                </div>
            </form>
        </div>
    </main>

<?php
include_once "includes/footer.inc.php";
?>