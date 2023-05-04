function logOutUser(){
  localStorage.removeItem("Authorization");
  localStorage.removeItem("UserInfo");
  window.location.href = "/client/auth/";
}