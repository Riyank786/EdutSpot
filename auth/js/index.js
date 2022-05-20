
function showLogin(){
  $("#loginScreen").show();
  $("#signupScreen").hide();
}
function showSignup(){
  $("#loginScreen").hide();
  $("#signupScreen").show();
}


// -------------------------------- signup handling -------------------------------- // 
function signup(data){
  
  const signupURL = " https://edu-spot.herokuapp.com/user/userSingup";

  const xhr = new XMLHttpRequest();
  xhr.open("POST", signupURL, true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(JSON.stringify(data));
  xhr.onload = function () {
    if (xhr.status != 200) {
      console.log(`Error ${xhr.status} : ${xhr.statusText}`);
    } else {
      if(xhr.responseText == "email exists"){
        toastr["warning"]('email already exists');
      } else if(xhr.responseText == "username exists"){
        toastr["warning"]('User Name already exists');
      } else{
        let response = JSON.parse(xhr.response);
        localStorage.setItem("Authorization", response.token)
        localStorage.setItem("UserInfo", JSON.stringify(response.data));
        window.location.href = "/EdutSpot";
      } 
    }
  };
}

function isEmail(email) {
  var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  return regex.test(email);
}

// new user signup
function signupUser(){
  const userName = $("#userName").val();
  const emailId = $("#userEmail").val();
  const password = $("#userPassword").val();
  const confirmPassword = $("#userConfirmPassword").val();
  const userRole = "user";

  if(!userName || !emailId || !password || !userRole){
    toastr["warning"]("Please fill all the details");
    return;
  }
  if(password != confirmPassword){
    toastr["warning"]("Passwords did not match.");
    return;
  }

  if(!isEmail(emailId)){
    toastr["warning"]("Please enter correct email address");
    return;
  }

  const data = {userName, emailId, password, userRole};

  signup(data);

}

// -------------------------------- login handling -------------------------------- // 
function login(data){

  const loginURL = " https://edu-spot.herokuapp.com/user/userLogin";

  const xhr = new XMLHttpRequest();
  xhr.open("POST", loginURL, true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(JSON.stringify(data));
  xhr.onload = function () {
    if (xhr.status != 200) {
      console.log(`Error ${xhr.status} : ${xhr.statusText}`);
      toastr["error"]("something went wrong, please try again later");
    } else {
      if(xhr.responseText == "please provide email or password"){
        toastr["error"]('Something went wrong, please try again');
      } else if(xhr.responseText == "Incorrect email or password"){
        toastr["warning"]('Incorrect email or password');
      } else{
        let response = JSON.parse(xhr.response);
        localStorage.setItem("Authorization", response.token);
        localStorage.setItem("UserInfo", JSON.stringify(response.data));
        window.location.href = "/EdutSpot/";
      } 
    }
  };

}

function loginUser(){
  const emailId = $("#loginUserEmail").val();
  const password = $("#loginUserPassword").val();
  if(!emailId || !password || emailId == "" || password == ""){
    toastr["warning"]("Please fill all details");
    return;
  }

  const data = { emailId, password };

  login(data);
}
