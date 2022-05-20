(function(send) {
  try {
    XMLHttpRequest.prototype.send = function(body) {
      const token = localStorage.getItem("Authorization");
      if(!token || token == "undefined"){
        localStorage.removeItem("Authorization");
        window.location.href = "/client/auth";
        return;
      }else{
        this.setRequestHeader("authorization", "Bearer "+token);
        this.setRequestHeader("userrole", "user");
        send.call(this, body);
      }
      };
  } catch (error) {
    console.error("error in interceptor", error);
  }
})(XMLHttpRequest.prototype.send);