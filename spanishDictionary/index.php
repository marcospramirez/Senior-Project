<?php
session_start();

if(!isset($_SESSION['email'])) {    //not logged in, redirect user to login
    header("Location: ./login.php");
    exit();
} else {    //logged in, redirect user to dashboard
    header("Location: ./dashboard.php");
    exit();
}