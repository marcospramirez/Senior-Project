<?php
session_start();
include_once "includes/head.inc.php";
include_once "includes/printSessionInfo.inc.php";

//INSTRUCTOR ONLY PAGE - redirect if not instructor
if($_SESSION['role'] !== "instructor") {
    header("Location: index.php");
    exit();
}

printHeadOpen('Add Students');
printGoogleFontsCdn();
printBootstrapCssCdn();
printJQueryCdn();
printBootstrapJsCdn();
printFontAwesomeIconsCdn();

printSessionInfo(array('email', 'role'));

echo '
    <!--CUSTOM CSS-->
    <link href="css/add.css" rel="stylesheet"/>
    <!--CUSTOM JS-->
    <script src="js/utils.js"></script>
    <script src="js/addClassroom.js"></script>
';

printHeadClose();
?>

<main>
    <div class="container content-frame border rounded">
        <br>
        <div class="row align-items-start">
            <h1 id="add-classroom-header" class="col">Add Classrooms</h1>
        </div>
        <hr class="hr-header">
        <form id="new-classroom-form" enctype="multipart/form-data" action="services/TBD.php?Action=addClassroom" method="POST">
            <div id="classrooms">
                <div class="classroom-name"> <!--Student #1 in Classroom-->
                    <div class="form-group"><input type="text" id="classroom1" class="form-control" title="Enter Classroom Name" name="classroomName[]" placeholder="Classroom Name" required></div>
                </div>
            </div>
            <div class="row"> <!--Button: Add New Classroom Name Field-->
                <div class="col" align="right"><button type="button" class="btn add-more" onclick="addClassroomField()"><i class="fas fa-plus"></i></button></div>
            </div>
            <div id="add-classroom-error-message"></div>
            <div class="row"> <!--Button: Add New Classrooms-->
                <div id="add-classroom-hidden"></div>  <!--add instructor email into POST-->
                <div class="col" align="center"><input type="submit" name="newClassrooms" value="Add Classrooms" id="submit-new" class="btn dark"></div>
            </div>
        </form>
    </div>
</main>

<?php
include_once "includes/footer.inc.php";
?>
