<?php

require_once("services/db.php");

//if not accessed internally nor through login, redirect to login
$currentPage = basename($_SERVER['PHP_SELF']);
if(!(isset($_SESSION['email']) || $currentPage == 'login.php')) {
    //redirect user back to login
    header("Location: ./login.php");
    exit();
}

function printHeadOpen($title) {
    echo "
    <!DOCTYPE html>
    <html lang=\"en\" dir=\"ltr\">
        <head>
            <meta http-equiv=\"Cache-control\" content=\"no-cache\"> <!-- for testing only -->
            <meta charset=\"utf-8\">
            <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">
            <!-- <link rel=\"icon\" href=\"static/images/favicon.ico\" type=\"image/x-icon\"> -->
            <title>$title</title>
    ";
}

function printGoogleFontsCdn() {
    echo '
            <!--GOOGLE FONTS-->
            <link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,600" rel="stylesheet">
    ';
}

function printJQueryCdn() {
    echo '
            <!-- JQUERY -->
            <script src="https://code.jquery.com/jquery-3.3.1.min.js"></script>
    ';
}

function printBootstrapCssCdn() {
    echo '
            <!--BOOTSTRAP CSS-->
            <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">
    ';
}

function printBootstrapJsCdn() {
    echo '
            <!--BOOTSTRAP JS-->
            <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.bundle.min.js" integrity="sha384-pjaaA8dDz/5BgdFUPX6M/9SUZv4d12SUPF0axWc+VRZkx5xU3daN+lYb49+Ax+Tl" crossorigin="anonymous"></script>
    ';
}

function printDataTablesCdn() {
    echo '
            <!--DATA TABLES BOOTSTRAP CSS-->
            <link rel="stylesheet" href="https://cdn.datatables.net/1.10.19/css/dataTables.bootstrap4.min.css">
            <!-- DATA TABLES CSS -->
            <link rel="stylesheet" href="https://cdn.datatables.net/responsive/2.2.3/css/responsive.dataTables.min.css">
            <link rel="stylesheet" href="https://cdn.datatables.net/buttons/1.5.2/css/buttons.dataTables.min.css">
            <!-- DATA TABLES JS -->
            <script src="https://cdn.datatables.net/1.10.19/js/jquery.dataTables.min.js"></script>
            <script src="https://cdn.datatables.net/1.10.19/js/dataTables.bootstrap4.min.js"></script>
            <!--CUSTOM CSS-->
            <link href="css/table.css" rel="stylesheet"/>
    ';
}

function printFontAwesomeIconsCdn() {
    echo '
            <!--FONT AWESOME SOLID ICON PACK-->
            <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.5.0/css/all.css" integrity="sha384-B4dIYHKNBt8Bc12p+WXckhzcICo0wtJAoU8YZTY5qE0Id1GSseTk6S+L3BlXeVIU" crossorigin="anonymous">
    ';
}

function printSelect2Cdn() {
    echo '
            <!--SELECT2 CSS-->
            <link href="https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.6-rc.0/css/select2.min.css" rel="stylesheet" />
            <!--SELECT2 JS-->
            <script src="https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.6-rc.0/js/select2.min.js"></script>
    ';
}

function printMagicGridCdn() {
    echo '
            <!--MAGIC GRID JS-->
            <script src="https://unpkg.com/magic-grid/dist/magic-grid.cjs.js"></script>
    ';
}

function printJQueryColorCdn() {
    echo '
            <!--JQUERY COLOR JS-->
            <script src="https://code.jquery.com/color/jquery.color-2.1.2.min.js"></script>
    ';
}

function printHeadClose() {
    echo '
            <!--BASE CSS-->
            <link href="css/base.css" rel="stylesheet"/>
        </head>
        <body>
    ';

    //show navigation bar when logged in
    if (isset($_SESSION['email'])) { //if there is a session, show nav bar

 

        $navHtml = '
            <header>
                <nav style="justify-content:left" class="navbar sticky-top navbar-light bg-light">
                    <a href="http://mramir14.create.stedwards.edu/spanishDictionary/dashboard.php" class="navbar-brand">Dashboard</a>';


        if(isset($_SESSION['role'])){
            $navHtml .= getClassroomsForNavHtml($_SESSION['email'], $_SESSION["role"]);
        }

        if(isset($_SESSION['classroomID']) && isset($_SESSION['classroomName'])) {
            $currentClassroomID = $_SESSION['classroomID'];
            $currentClassroomName = $_SESSION['classroomName'];

            $navHtml .= '<div class="dropdown" style="margin-right: 1rem">
                      <button class="btn btn-secondary dropdown-toggle" type="button" id="classroomNavigation" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">'.
                        $currentClassroomName.'
                      </button>

                      <div class="dropdown-menu" aria-labelledby="classroomNavigation">
                        <a class="dropdown-item" href="http://mramir14.create.stedwards.edu/spanishDictionary/classroom.php">Dictionaries</a>
                        <a class="dropdown-item" href="http://mramir14.create.stedwards.edu/spanishDictionary/forum.php">Forum</a>
                      </div>
                    </div>';
        }
                                        
                    
            $navHtml .='                           
                    <button type="button" class="btn" onclick="logout()">Logout</button>
                </nav>
            </header>';

        echo $navHtml;
    }

}

function getClassroomsForNavHtml($email, $role){
    $currentClass = -1;
    if(isset($_SESSION['classroomID'])){
        $currentClass = $_SESSION['classroomID'];
    }
    $html = "";
    $sql;
    if($role =="instructor"){
        $sql = "SELECT classID, className FROM Classroom, Instructor WHERE instructorEmail = email AND email = '$email';";
    }
    else{
        $sql = "SELECT classID, className FROM Classroom, studentToClassroom WHERE studentToClassroom.studentEmail = '$email' and studentToClassroom.classroomID = Classroom.classID";
    }

    $conn = returnConnection();

    if ($result = $conn->query($sql)) { //query successful
        $html .= '<div class="dropdown" style="margin-right: 1rem">
                <button class="btn btn-secondary dropdown-toggle" type="button" id="switchClassrooms" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    Switch Classrooms
                </button>

            <div class="dropdown-menu" aria-labelledby="switchClassrooms">';

        if ($result->num_rows > 0){

            while($row = $result->fetch_assoc()){
                $className = $row["className"];
                $classID = $row["classID"];

                $activeClass = "";
                if($classID == $currentClass){
                    $activeClass = "active";
                }

                $html .= '<button class="dropdown-item '.$activeClass. '" onclick="switchtoClassroom('.$classID.' ,\'' .$className . '\')">'.$className.'</button>';
            }
        }
        
        if($role == "instructor"){
            $html .= '<div class="dropdown-divider"></div>
                        <a class="dropdown-item" href="#">Add Classroom</a>';
        }
                           
        $html .=     '</div>
                    </div>'; 

    }

    return $html;



}