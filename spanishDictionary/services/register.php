<?php
    require_once("db.php");

    $conn = returnConnection();

    if(isset($_POST["email"])) {  //if data in post, try to insert user
        $user = $_POST["user"];
        $insertUserResult = registerUser($user, $conn);
        if($insertUserResult == "REGISTERED") {
            print("success");
        }elseif($insertUserResult == "DUPLICATE") {
            print("duplicate");
        }else {
            print($insertUserResult);
        }
    }//end of check if there is data in post

    closeConnection($conn);

function registerUser($user, $conn) {
    $name = $_POST["name"];
    $email = $_POST["email"];
    $password = $_POST["password"];
    $sql = "";

    if($user == "STUDENT") {    //check if student is in db
        $sql = "UPDATE student SET password = '$password', name = '$name' WHERE email = '$email';";
    } elseif($user == "INSTRUCTOR") {   //add instructor to db
        $sql = "INSERT INTO instructor (email, password, name) VALUES ('$email', '$password', '$name');";
    }

    if ($conn->query($sql) && ($conn->affected_rows > 0)) { //register successful
        return "REGISTERED";
    }else {
        if($conn->errno == 1062) {    //1062: duplicate entry
            return "DUPLICATE";
        }
        return "Error: " . $sql . "<br>" . $conn->error;
    }
}//end of insertUser
