<?php
    require_once("services/db.php");

    function getClassNameIdPair() {
        $conn = returnConnection();

        if(isset($_GET['email'])) {
            $email = $_GET['email'];
            $permission = $_GET['permission'];

            if($permission == 'student') {
                $sql = "SELECT c.className AS 'name', c.classID AS 'id' FROM Student s, studentToClassroom t, Classroom c WHERE s.email = t.studentEmail AND t.classroomID = c.classID AND s.email = '$email';";

            }elseif($permission == 'instructor') {
                $sql = "SELECT className AS 'name', classID AS 'id' FROM Classroom, Instructor WHERE instructorEmail = email AND email = '$email';";

            }

            $classNameArray = array();
            $classIdArray = array();

            if ($result = $conn->query($sql)) { //query successful
                while ($row = $result->fetch_assoc()) {
                    array_push($classNameArray, $row['name']);
                    array_push($classIdArray, $row['id']);
                }
            }
            else {  //fail: show error message
                echo "Error: " . $sql . "<br>" . $conn->error;
            }

            $classNameIdPairArray = array(
                "nameArray" => $classNameArray,
                "idArray" => $classIdArray
            );

            return $classNameIdPairArray;
        }
        closeConnection($conn);
    }
?>

<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Dashboard</title>

    <!--GOOGLE FONTS-->
    <link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,600" rel="stylesheet">
    <!--BOOTSTRAP CSS-->
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">
    <!-- JQUERY -->
    <script src="https://code.jquery.com/jquery-3.3.1.min.js"></script>
    <!--BOOTSTRAP JS-->
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.bundle.min.js" integrity="sha384-pjaaA8dDz/5BgdFUPX6M/9SUZv4d12SUPF0axWc+VRZkx5xU3daN+lYb49+Ax+Tl" crossorigin="anonymous"></script>
    <!--CUSTOM CSS-->
    <link href="css/base.css" rel="stylesheet"/>
    <link href="css/dashboard.css" rel="stylesheet"/>
    <!--CUSTOM JS-->
    <script src="js/utils.js"></script>

</head>
<body>
<main>
    <header>
        <nav class="navbar sticky-top navbar-light bg-light justify-content-between">
            <a class="navbar-brand">Marcos<b>&</b>Vickie</a>
        </nav>
    </header>
    <div class="card">
        <div class="card-header">
            <h2>Classrooms</h2>
        </div>
        <div class="card-body">
            <?php
                $classNameIdPairArray = getClassNameIdPair();
                $classNameArray = $classNameIdPairArray["nameArray"];
                $classIdArray = $classNameIdPairArray["idArray"];


                if(sizeof($classNameArray) > 0) {
                    for ($i = 0; ($i <= 4 && $i <= sizeof($classNameArray)-1); $i++) {
                        echo $classNameArray[$i];
                        if(($i + 1) <= 10) echo '<br>';
                    }
                }
                else {
                    echo "<div align='center'>";
                        echo "<h3>No Classrooms.</h3>";
//                        echo "<h3>Add One Now.</h3>";
//                        echo '<button class="btn dark" onclick="window.location.replace(`add-dictionary.html`) >Add One Now</button>';
                    echo "</div>";
                }
            ?>
        </div>
        <div class="card-footer">
            <button class="btn" onclick="window.location.replace('classrooms.html?email=<?php print_r($_GET['email']) ?>')">More...</button>
        </div>
    </div>

</main>
</body>
</html>
