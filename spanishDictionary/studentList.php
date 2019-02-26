<?php
session_start();
include_once "includes/head.inc.php";
include_once "includes/printSessionInfo.inc.php";

//INSTRUCTOR ONLY PAGE - redirect if not instructor
if($_SESSION['role'] !== "instructor") {
    header("Location: login.php");
    exit();
}

printHeadOpen('Student List');
printGoogleFontsCdn();
printBootstrapCssCdn();
printJQueryCdn();
printJQueryColorCdn();
printBootstrapJsCdn();
printDataTablesCdn();
printFontAwesomeIconsCdn();

printSessionInfo(array('email', 'role', 'classroomID', 'classroomName'));

echo '
    <!--CUSTOM CSS-->
    <link href="css/studentList.css" rel="stylesheet"/>
    <!--CUSTOM JS-->
    <script src="js/utils.js"></script>
    <script src="js/studentList.js"></script>
';

printHeadClose();
?>

    <main class="container">
        <div id="student-list-header" class="header row align-items-start">
            <h1 id="classroom-name" class="col"></h1>
        </div>
        <div class="container content-frame border rounded">
            <br>
            <div id="table"><table id="table-student-list" class="table table-hover" style="width:100%"></table></div>
            <br>
        </div>
    </main>


<!-- Edit Student Modal -->
<div class="modal fade editStudent" id="edit-student" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered editStudent" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="modal-title">Edit Student</h2>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            </div>
            <form id="edit-student-form" name="editStudentForm">
                <div class="modal-body">
                    <div style="text-align: center;"><div id="edit-error-message" class="error-message"></div></div>
                    <div class="form-group">
                        <label for="studentName" class="col-form-label">Edit Student Name:</label>
                        <input type="text" class="form-control" id="studentName" name="sName">
                    </div>
                    <div class="form-group">
                        <label for="studentEmail" class="col-form-label">Edit Student Email:</label>
                        <input type="text" class="form-control" id="studentEmail" name="sEmail">
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
<!-- End Edit Student Modal -->

<!-- Delete Student Modal -->
<div class="modal fade deleteStudent" id="delete-student" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered deleteStudent" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="modal-title">Remove Student from Classroom</h2>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            </div>
            <div class="modal-body">
                <div style="text-align: center;"><div id="delete-error-message" class="error-message"></div></div>
                <p>Are you sure you want to remove <span id="deleting-student" style="font-weight: bold"></span> from the classroom?</p>
            </div>
            <div class="modal-footer">
                <button type="button" id="submit-delete" class="btn dark">Remove</button>
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            </div>
        </div>
    </div>
</div>
<!-- End Delete Student Modal -->
