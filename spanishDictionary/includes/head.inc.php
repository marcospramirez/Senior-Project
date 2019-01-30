<?php

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

function printHeadClose() {
    echo '
            <!--BASE CSS-->
            <link href="css/base.css" rel="stylesheet"/>
        </head>
        <body>
    ';

    //show navigation bar when logged in
    if (!isset($_SESSION['email'])) { //if there is a session, show nav bar
        echo '
            <header>
                <nav class="navbar sticky-top navbar-light bg-light justify-content-between">
                    <a class="navbar-brand">Marcos<b>&</b>Vickie</a>
                </nav>
            </header>';
    }

}