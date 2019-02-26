<?php
    require_once("./db.php");

    $conn = returnConnection();

    if(isset($_POST["email"])) {  //if data in post, try to insert user
        $user = $_POST["user"];
        $insertUserResult = registerUser($user, $conn);
        if($insertUserResult == "REGISTERED") {
            print("success");
        }elseif($insertUserResult == "DUPLICATE") {
            print("duplicate");
        }else {
            echo json_encode(array("error" => $insertUserResult));
        }
    }//end of check if there is data in post

    closeConnection($conn);

function registerUser($user, $conn) {
    $name = $_POST["name"];
    $email = $_POST["email"];
    $password = $_POST["password"];
    $sql = "";

    if($user == "STUDENT") {    //check if student is in db
        $sql = "UPDATE Student SET Student.password = '$password', Student.name = '$name' WHERE Student.email = '$email';";
    } elseif($user == "INSTRUCTOR") {   //add instructor to db
        $sql = "INSERT INTO Instructor (email, password, name) VALUES ('$email', '$password', '$name');";
    }

    if ($conn->query($sql) && ($conn->affected_rows > 0)) { //register successful
        return "REGISTERED";
    }else {
        if($conn->errno == 1062) {    //1062: duplicate entry
            return "DUPLICATE";
        }
        return $conn->error;
    }
}//end of insertUser

?>