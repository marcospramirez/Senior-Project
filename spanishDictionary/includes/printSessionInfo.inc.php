<?php
if(!isset($_SESSION['email'])) {    //not accessed internally
    //redirect user back to login
    header("Location: ./login.php");
    exit();
}

function printSessionInfo($requestedSessionInfoArray) {
    echo '<script type="text/javascript">';
    foreach ($requestedSessionInfoArray as $sessionInfoName) {
        //using json_encode to properly escape
        if(isset($_SESSION[$sessionInfoName])) { echo 'var '.$sessionInfoName.'FromSession = '.json_encode($_SESSION[$sessionInfoName]).';'; }
        else { missingSessionInfoRedirect($sessionInfoName); }//else, sessionInfo is not set: redirect to the page where that would usually be set
    }   //end of foreach
    echo '</script>';
}

//sessionInfo is not set: redirect to the page where that would usually be set
function missingSessionInfoRedirect($sessionInfoName) {
    switch ($sessionInfoName) {
        case 'role':
            header("Location: ./login.php");
            exit();
            break;
        case 'classroomID':
            header("Location: ./dashboard.php");
            exit();
            break;
        case 'classroomName':
            header("Location: ./dashboard.php");
            exit();
            break;
        case 'dictionaryID':
            header("Location: ./classroom.php");
            exit();
            break;
        case 'dictionaryName':
            header("Location: ./classroom.php");
            exit();
            break;
        case 'personalVocabID':
            header("Location: ./classroom.php");
            exit();
            break;
        case 'addDictionaryFlag':
            header("Location: ./classroom.php");
            exit();
            break;
        default:
            header("Location: ./login.php");
            exit();
            break;
    }
}//end of missingSessionInfoRedirect

//returns whether we're adding to an empty dictionary or a populated dictionary
function getAddDictionaryFlag() {
    if(isset($_SESSION['addDictionaryFlag'])) return $_SESSION['addDictionaryFlag'];
    else return null;
}