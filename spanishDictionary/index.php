<?php
	$role = $_POST["role"];
	$email = $_POST["email"];

?>

<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- <link rel="icon" href="static/images/favicon.ico" type="image/x-icon"> -->
    <title>Classroom Dashboard</title>

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
    <!--CUSTOM CSS-->
    <link href="css/base.css" rel="stylesheet"/>
    <link href="css/table.css" rel="stylesheet"/>
    <!--CUSTOM JS-->
    <script src="js/utils.js"></script>

    <script type="text/javascript">
        
        let email = "<?php echo $email?>";
        let role = "<?php echo $role?>";

    </script>

    <?php

        if($role == "student"){
            echo '<script src="js/classroom-dashboard-student.js"></script>';
        }
        else if ($role == "instructor"){
            echo '<script src="js/classroom-dashboard.js"></script>';
        }
    ?>


</head>
<body>

    <main>
        <div class="container content-frame border rounded">
            <br>
            <h1 class="col">Classrooms</h1>
            <hr class="hr-header">
            <table id="table-classrooms" class="table table-hover" style="width:100%"></table>
            <br>
        </div>
    </main>
</body>
</html>