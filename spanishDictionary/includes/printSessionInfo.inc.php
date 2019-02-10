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
        //todo: if sessionInfo is not set, redirect to the page where that would usually be set
    }   //end of foreach
    echo '</script>';
}