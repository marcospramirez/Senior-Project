<?php
session_start();

if(!isset($_SESSION['email'])) {    //not accessed internally
    //redirect user back to login
    header("Location: ./login.php");
    exit();
}