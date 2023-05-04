// to sort the classes
function compareNumbers(a, b) {
  return a - b;
}
// get request to url
function httpGet(theUrl) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open("GET", theUrl, false);
  xmlHttp.send(null);
  return xmlHttp.responseText;
}
// getting all classes
function getClasses() {
  let url = " http://localhost:3000/";
  let classes = [];
  let data = JSON.parse(httpGet(url));
  data.forEach((el) => {
    classes.push(el.class);
  });
  classes = classes.sort(compareNumbers);
  return classes;
}

function getSubjects(cls){
  let url = ` http://localhost:3000/subject?class=${cls}`;
  let subjects = [];
  let data = JSON.parse(httpGet(url));
  data.forEach((el) => {
    subjects.push(el.subject);
  });
  return subjects;
}