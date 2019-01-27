<?php
session_start();
include_once "includes/head.inc.php";
printHeadOpen('Login');
printGoogleFontsCdn();
printBootstrapCssCdn();
printBootstrapJsCdn();
echo '
        <!--CUSTOM CSS-->
        <link href="css/loginRegister.css" rel="stylesheet"/>
        <!--CUSTOM JS-->
        <script src="js/toggleLoginRegister.js"></script>
        <script src="js/login.js"></script>
        <script src="js/register.js"></script>
';
printHeadClose();
?>

<main>
    <!-- LOGIN FORM -->
    <div id="login-div" class="container content-frame border rounded container-login-register">
        <div id="login-error-message"></div>
        <div id="register-success-message"></div>
        <h1>Log in</h1>
        <form id="login-form">
            <div class="form-group">
                <input type="email" class="form-control input-login-register" id="login-email" placeholder="email" required>
                <input type="password" class="form-control input-login-register" id="login-password" placeholder="password" required>
                <button class="btn btn-primary btn-login-register" type="submit" name="login-submit">Log In</button>
            </div>
        </form>
        <hr class="hr-login-register">
        <h2>New User?</h2>
        <button class="btn btn-primary btn-login-register" onclick="showRegisterStudent()">Sign up as Student</button>
        <br><br>
        <button class="btn btn-primary btn-login-register" onclick="showRegisterInstructor()">Sign up as Instructor</button>
    </div>


    <!-- STUDENT REGISTER FORM: HIDDEN AT DOC LOAD -->
    <div id="register-student-div" class="container content-frame border rounded container-login-register" style="display: none;">
        <div id="register-student-error-message"></div>
        <h1>Sign up as Student</h1>
        <form id="register-student-form">
            <div class="form-group">
                <input type="text" class="form-control input-login-register" id="register-student-name" placeholder="name" required>
                <input type="email" class="form-control input-login-register" id="register-student-email" placeholder="email" required>
                <input type="password" class="form-control input-login-register" id="register-student-password" placeholder="password" required>
                <input type="password" class="form-control input-login-register" id="register-student-password-confirm" placeholder="confirm password" required>
                <button class="btn btn-primary btn-login-register" type="submit" name="register-student-submit">Sign Up</button>
            </div>
        </form>
        <hr class="hr-login-register">
        <h2>Already Registered?</h2>
        <button class="btn btn-primary btn-login-register" onclick="showLogin()">Back to Log in</button>
    </div>


    <!-- INSTRUCTOR REGISTER FORM: HIDDEN AT DOC LOAD -->
    <div id="register-instructor-div" class="container content-frame border rounded container-login-register" style="display: none;">
        <div id="register-instructor-error-message"></div>
        <h1>Sign up as a Instructor</h1>
        <form id="register-instructor-form">
            <div class="form-group">
                <input type="text" class="form-control input-login-register" id="register-instructor-name" placeholder="name" required>
                <input type="email" class="form-control input-login-register" id="register-instructor-email" placeholder="email" required>
                <input type="password" class="form-control input-login-register" id="register-instructor-password" placeholder="password" required>
                <input type="password" class="form-control input-login-register" id="register-instructor-password-confirm" placeholder="confirm password" required>
                <button class="btn btn-primary btn-login-register" type="submit" name="register-instructor-submit">Sign Up</button>
            </div>
        </form>
        <hr class="hr-login-register">
        <h2>Already Registered?</h2>
        <button class="btn btn-primary btn-login-register" onclick="showLogin()">Back to Log in</button>
    </div>
</main>

