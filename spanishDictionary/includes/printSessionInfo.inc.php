<?php
session_start();

if(!isset($_SESSION['email'])) {    //not accessed internally
    //redirect user back to login
    header("Location: ./login.php");
    exit();
}

//All data that can be added to the session: email, userType, classroomID, classroomName, dictionaryID, dictionaryName

function printSessionInfo($requestedSessionInfoArray) {
    echo '<script type="text/javascript">';
    foreach ($requestedSessionInfoArray as $sessionInfoName) {
        //using json_encode to properly escape
        if(isset($_SESSION[$sessionInfoName])) { echo 'var '.$sessionInfoName.'FromSession = "'.json_encode($_SESSION[$sessionInfoName]).'";'; }


//        if($sessionInfoName !== 'email') { if(isset($_SESSION['email'])) { echo 'var emailSession = "'.json_encode($_SESSION['email']).'";';}}
//        if($sessionInfoName !== 'userType') if(isset($_SESSION['userType'])) { { echo 'var userTypeSession = "'.json_encode($_SESSION['userType']).'";';}}
//        if($sessionInfoName !== 'classroomID') if(isset($_SESSION['classroomID'])) { { echo 'var classroomIDSession = "'.json_encode($_SESSION['classroomID']).'";';}}
//        if($sessionInfoName !== 'classroomName') if(isset($_SESSION['classroomName'])) { { echo 'var classroomNameSession = "'.json_encode($_SESSION['classroomName']).'";';}}
//        if($sessionInfoName !== 'dictionaryID') if(isset($_SESSION['dictionaryID'])) { { echo 'var dictionaryIDSession = "'.json_encode($_SESSION['dictionaryID']).'";';}}
//        if($sessionInfoName !== 'dictionaryName') if(isset($_SESSION['dictionaryName'])) { { echo 'var dictionaryNameSession = "'.json_encode($_SESSION['dictionaryName']).'";';}}
    }   //end of foreach
    echo '</script>';
}