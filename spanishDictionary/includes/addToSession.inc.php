<?php
session_start();

if(!(isset($_SESSION['email']) || isset($_POST['email']))) {    //not accessed internally nor through login
    //redirect user back to login
    header("Location: ./login.php");
    exit();
}

//All data that can be added to the session: email, role, classroomID, classroomName, dictionaryID, dictionaryName, personalVocabID, addDictionaryFlag
if(isset($_POST['email'])) $_SESSION['email'] = $_POST['email'];
if(isset($_POST['role'])) $_SESSION['role'] = $_POST['role'];
if(isset($_POST['classroomID'])) $_SESSION['classroomID'] = $_POST['classroomID'];
if(isset($_POST['classroomName'])) $_SESSION['classroomName'] = $_POST['classroomName'];
if(isset($_POST['dictionaryID'])) $_SESSION['dictionaryID'] = $_POST['dictionaryID'];
if(isset($_POST['dictionaryName'])) $_SESSION['dictionaryName'] = $_POST['dictionaryName'];
if(isset($_POST['personalVocabID'])) $_SESSION['personalVocabID'] = $_POST['personalVocabID'];
if(isset($_POST['addDictionaryFlag'])) $_SESSION['addDictionaryFlag'] = $_POST['addDictionaryFlag'];

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

