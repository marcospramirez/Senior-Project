<?php
session_start();
include_once "includes/head.inc.php";
printHeadOpen('Add Students');
printGoogleFontsCdn();
printBootstrapCssCdn();
printJQueryCdn();
printBootstrapJsCdn();
printFontAwesomeIconsCdn();

include_once "includes/printSessionInfo.inc.php";
printSessionInfo(array('role', 'classroomID', 'classroomName'));

echo '
    <!--CUSTOM CSS-->
    <link href="css/add.css" rel="stylesheet"/>
    <!--CUSTOM JS-->
    <script src="js/utils.js"></script>
    <script src="js/addStudent.js"></script>
';

printHeadClose();
?>

<!-- Import Students Modal -->
<div class="modal fade importFile" id="import-file" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered importFile" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="modal-title">Import Students</h2>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <form id="import-student-form" action="services/studentService.php?Action=addStudentsCSV" method="POST" enctype="multipart/form-data">
                <div class="modal-body">
                    <div id="import-error-message"></div>
                    <div class="form-group">
                        <label for="importFile" class="col-form-label">Import from csv:</label>
                        <input type="file" id="importFile" class="form-control" accept=".csv" name="csv" required>
                    </div>
                </div>
                <div class="modal-footer">
                    <div id="import-hidden"></div>
                    <input type="submit" name="submit_csv" value="Import Students" class="btn dark">
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
            <h1 id="add-students-header" class="col">Add Students to </h1>
            <button id="add-import" class="col-sm-auto btn dark" data-toggle="modal" data-target="#import-file">Import Students</button>
        </div>
        <hr class="hr-header">
        <form id="new-students-form" enctype="multipart/form-data" action="services/studentService.php?Action=addStudents" method="POST">
            <div id="students">
                <div class="student-email"> <!--Student #1 in Classroom-->
                    <div class="form-group"><input type="text" id="student1" class="form-control" title="studentEmail" name="studentEmail[]" placeholder="Student Email" required></div>
                </div>
            </div>
            <div class="row"> <!--Button: Add New Student Email Field-->
                <div class="col" align="right"><button type="button" class="btn add-more" onclick="addStudentField()"><i class="fas fa-plus"></i></button></div>
            </div>
            <div id="add-students-error-message"></div>
            <div class="row"> <!--Button: Add New Students-->
                <div id="add-students-hidden"></div>  <!--add classID into POST-->
                <div class="col" align="center"><input type="submit" name="newStudents" value="Add Students" id="submit-new" class="btn dark"></div>
            </div>
        </form>
    </div>
</main>

<?php
include_once "includes/footer.inc.php";
?>
