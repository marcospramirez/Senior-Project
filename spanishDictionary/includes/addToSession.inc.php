<?php
session_start();

if(!(isset($_SESSION['email']) || isset($_POST['email']))) {    //not accessed internally or through login
    //redirect user back to login
    header("Location: ./login.php");
    exit();
}

//All data that can be added to the session: email, role, classroomID, classroomName, dictionaryID, dictionaryName, personalVocabID

if(isset($_POST['email'])) {
    $email = $_POST['email'];
    $_SESSION['email'] = $email;
}
if(isset($_POST['role'])) {
    $role = $_POST['role'];
    $_SESSION['role'] = $role;
}
if(isset($_POST['classroomID'])) {
    $classroomID = $_POST['classroomID'];
    $_SESSION['classroomID'] = $classroomID;
}
if(isset($_POST['classroomName'])) {
    $classroomName = $_POST['classroomName'];
    $_SESSION['classroomName'] = $classroomName;
}
if(isset($_POST['dictionaryID'])) {
    $dictionaryID = $_POST['dictionaryID'];
    $_SESSION['dictionaryID'] = $dictionaryID;
}
if(isset($_POST['dictionaryName'])) {
    $dictionaryName = $_POST['dictionaryName'];
    $_SESSION['dictionaryName'] = $dictionaryName;
}
if(isset($_POST['personalVocabID'])) {
    $personalVocabID = $_POST['personalVocabID'];
    $_SESSION['personalVocabID'] = $personalVocabID;
}
if(isset($_POST["logout"])){
    session_destroy();
}

