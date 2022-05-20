const theUrl = ' https://edu-spot.herokuapp.com/userAuthentication';
var xmlHttp = new XMLHttpRequest();
xmlHttp.open("GET", theUrl, false);
xmlHttp.send(null);
let data = JSON.parse(xmlHttp.responseText);
if(data.status == "not logged in"){
  window.location.href = "/EdutSpot/auth";
}