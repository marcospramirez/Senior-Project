function showLogin() {
  var login = document.getElementById("login-div")
  var registerStudent = document.getElementById("register-student-div")
  var registerInstructor = document.getElementById("register-instructor-div")

  login.style.display = "block"
  registerStudent.style.display = "none"
  registerInstructor.style.display = "none"

  //update title to reflect content change
  document.title = 'Login'
}

function showRegisterStudent() {
  var login = document.getElementById("login-div")
  var registerStudent = document.getElementById("register-student-div")
  var registerInstructor = document.getElementById("register-instructor-div")

  login.style.display = "none"
  registerStudent.style.display = "block"
  registerInstructor.style.display = "none"

  //update title to reflect content change
  document.title = 'Register as Student'
}

function showRegisterInstructor() {
  var login = document.getElementById("login-div")
  var registerStudent = document.getElementById("register-student-div")
  var registerInstructor = document.getElementById("register-instructor-div")

  login.style.display = "none"
  registerStudent.style.display = "none"
  registerInstructor.style.display = "block"

  //update title to reflect content change
  document.title = 'Register as Instructor'
}
