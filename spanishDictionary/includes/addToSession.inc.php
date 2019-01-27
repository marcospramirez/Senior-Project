<?php
session_start();

//All data that can be added to the session: email, userType, classroomID, classroomName, dictionaryID, dictionaryName

if(isset($_POST['email'])) {
    $email = $_POST['email'];
    $_SESSION['email'] = $email;
}
if(isset($_POST['userType'])) {
    $userType = $_POST['userType'];
    $_SESSION['userType'] = $userType;
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

