<?php
require_once("db.php");

$conn = returnConnection();

if(isset($_POST["email"])) {  //if data in post, check user
    $result = checkUser($conn);

    print($result);
}//end of check if there is data in post

closeConnection($conn);

function checkUser($conn) {
    $email = $_POST["email"];
    $password = $_POST["password"];

    $checkUserStudentResult = checkUserStudent($conn, $email, $password);
    $checkUserInstructorResult = checkUserInstructor($conn, $email, $password);

    if($checkUserStudentResult == "STUDENT") {
        return "student";
    } elseif($checkUserInstructorResult == "INSTRUCTOR") {
        return "instructor";
    } elseif($checkUserStudentResult == "EMPTY" || $checkUserInstructorResult == "EMPTY") {   //user doesn't exist
        return "none";
    }
    //how do i handle uncaught errors???????
}

function checkUserStudent($conn, $email, $password) {
    $sql = "SELECT * FROM student WHERE email = '$email' AND password = '$password';";

    if ($conn->query($sql) && ($conn->affected_rows > 0)) { //student exists
        return "STUDENT";
    } elseif($conn->affected_rows == 0) {   //no results, student doesn't exist
        return "EMPTY";
    } else {
        return "Error: " . $sql . "<br>" . $conn->error;
    }
}

function checkUserInstructor($conn, $email, $password) {
    $sql = "SELECT * FROM instructor WHERE email = '$email' AND password = '$password';";

    if ($conn->query($sql) && ($conn->affected_rows > 0)) { //instructor exists
        return "INSTRUCTOR";
    } elseif($conn->affected_rows == 0) {   //no results, instructor doesn't exist
        return "EMPTY";
    } else {
        return "Error: " . $sql . "<br>" . $conn->error;
    }
}

