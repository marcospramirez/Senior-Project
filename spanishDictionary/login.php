<?php
session_start();
include_once "includes/head.inc.php";
printHeadOpen('Login');
printGoogleFontsCdn();
printBootstrapCssCdn();
printJQueryCdn();
printBootstrapJsCdn();
echo '
        <!--CUSTOM CSS-->
        <link href="css/loginRegister.css" rel="stylesheet"/>
        <!--CUSTOM JS-->
        <script src="js/utils.js"></script>
        <script src="js/toggleLoginRegister.js"></script>
        <script src="js/login.js"></script>
        <script src="js/register.js"></script>
';
printHeadClose();
?>

<main>
    <!-- LOGIN FORM -->
    <div id="login-div" class="container content-frame border rounded">
        <img id="login-logo" src="images/logo.png" alt="Accent Logo">
        <div id="login-error-message"></div>
        <div id="register-success-message" class="success-message"></div>
        <h1>Log in</h1>
        <form id="login-form">
            <div class="form-group">
                <input type="email" class="form-control input" id="login-email" placeholder="email" required>
                <input type="password" class="form-control input" id="login-password" placeholder="password" required>
                <button class="btn" type="submit" name="login-submit">Log In</button>
            </div>
        </form>
        <hr class="hr-login-register">
        <h2>New User?</h2>
        <button class="btn" onclick="showRegisterStudent()">Sign up as Student</button>
        <br><br>
        <button class="btn" onclick="showRegisterInstructor()">Sign up as Instructor</button>
    </div>


    <!-- STUDENT REGISTER FORM: HIDDEN AT DOC LOAD -->
    <div id="register-student-div" class="container content-frame border rounded" style="display: none;">
        <img class="register-logo" src="images/logo.png" alt="Accent Logo">
        <div id="register-student-error-message" class="red error-message"></div>
        <h1>Sign up as Student</h1>
        <form id="register-student-form">
            <div class="form-group">
                <input type="text" class="form-control input" id="register-student-name" placeholder="name" required>
                <input type="email" class="form-control input" id="register-student-email" placeholder="email" required>
                <input type="password" class="form-control input" id="register-student-password" placeholder="password" required>
                <input type="password" class="form-control input" id="register-student-password-confirm" placeholder="confirm password" required>
                <button class="btn" type="submit" name="register-student-submit">Sign Up</button>
            </div>
        </form>
        <hr>
        <h2>Already Registered?</h2>
        <button class="btn" onclick="showLogin()">Back to Log in</button>
    </div>


    <!-- INSTRUCTOR REGISTER FORM: HIDDEN AT DOC LOAD -->
    <div id="register-instructor-div" class="container content-frame border rounded" style="display: none;">
        <img class="register-logo" src="images/logo.png" alt="Accent Logo">
        <div id="register-instructor-error-message" class="red error-message"></div>
        <h1>Sign up as Instructor</h1>
        <form id="register-instructor-form">
            <div class="form-group">
                <input type="text" class="form-control input" id="register-instructor-name" placeholder="name" required>
                <input type="email" class="form-control input" id="register-instructor-email" placeholder="email" required>
                <input type="password" class="form-control input" id="register-instructor-password" placeholder="password" required>
                <input type="password" class="form-control input" id="register-instructor-password-confirm" placeholder="confirm password" required>
                <button class="btn" type="submit" name="register-instructor-submit">Sign Up</button>
            </div>
        </form>
        <hr>
        <h2>Already Registered?</h2>
        <button class="btn" onclick="showLogin()">Back to Log in</button>
    </div>
</main>

