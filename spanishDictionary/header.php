<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- <link rel="icon" href="static/images/favicon.ico" type="image/x-icon"> -->
    <title>Marcos & Vickie</title>

    <!--GOOGLE FONTS-->
    <link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,600" rel="stylesheet">
    <!--BOOTSTRAP CSS-->
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">
    <link rel="stylesheet" href="https://cdn.datatables.net/1.10.19/css/dataTables.bootstrap4.min.css">
    <!-- DATA TABLES CSS -->
    <link rel="stylesheet" href="https://cdn.datatables.net/responsive/2.2.3/css/responsive.dataTables.min.css">
    <link rel="stylesheet" href="https://cdn.datatables.net/buttons/1.5.2/css/buttons.dataTables.min.css">
    <!-- JQUERY -->
    <script src="https://code.jquery.com/jquery-3.3.1.min.js"></script>
    <!--BOOTSTRAP JS-->
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.bundle.min.js" integrity="sha384-pjaaA8dDz/5BgdFUPX6M/9SUZv4d12SUPF0axWc+VRZkx5xU3daN+lYb49+Ax+Tl" crossorigin="anonymous"></script>
    <!-- DATA TABLES JS -->
    <script src="https://cdn.datatables.net/1.10.19/js/jquery.dataTables.min.js"></script>
    <script src="https://cdn.datatables.net/1.10.19/js/dataTables.bootstrap4.min.js"></script>
    <!--FONT AWESOME SOLID ICON PACK-->
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.5.0/css/all.css" integrity="sha384-B4dIYHKNBt8Bc12p+WXckhzcICo0wtJAoU8YZTY5qE0Id1GSseTk6S+L3BlXeVIU" crossorigin="anonymous">
    <!--CUSTOM CSS-->
    <link href="css/base.css" rel="stylesheet"/>
    <link href="css/table.css" rel="stylesheet"/>
    <!--CUSTOM JS-->
    <script src="js/dictionary.js"></script>


  </head>
  <body>
    <?php
    //show navigation bar when logged in
     if (!isset($_SESSION['user'])) { //if there is a session, show nav bar
       echo '<header>
        <nav class="navbar sticky-top navbar-light bg-light justify-content-between">
            <a class="navbar-brand">Marcos<b>&</b>Vickie</a>
        </nav>
    </header>';
     }
    ?>

</html>