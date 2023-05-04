let url = window.location.href;
url = new URL(url);
let cls = url.searchParams.get("class");

let subjectList = [];

let urls = ` http://localhost:3000/subject?class=${cls}`;
function httpGet(theUrl) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open("GET", theUrl, false);
  xmlHttp.send(null);
  return xmlHttp.responseText;
}

function goToChaptersPage(subject) {
  window.location.href = `chapters.html?class=${cls}&subject=${subject}`;
}

function setSubjectCards() {
  let subjects = JSON.parse(httpGet(urls));

  subjects.forEach((subject) => {
    subjectList.push(subject.subject);
    let imgLink = "";
    switch (subject.subject) {
      case "Maths":
        imgLink = "./images/maths.png";
        break;

      case "Science":
        imgLink = "./images/science.jpg";
        break;

      case "English":
        imgLink = "./images/english.jpg";
        break;

      case "Social Science":
        imgLink = "./images/social-science.png";
        break;

      default:
        imgLink = "./images/science.jpg";
        break;
    }
    $("#body-wrapper").append(`
        <div class="card">
            <div class="subject-image">
                <img src="${imgLink}" alt="${
      subject.subject
    }" height="100%" width="100%">
            </div>
            <div class="subject-desc">
                <h4>${subject.subject}</h4>
                <p>${subject.chapters} ${
      subject.chapters > 1 ? "chapters" : "chapter"
    }</p>
                <button ${subject.chapters == 0 ? 'disabled' : ''}  onclick="goToChaptersPage('${
                  subject.subject
                }')")">Explore</button>
            </div>
        </div>
        `);
  });

  if (!cls || cls == null || cls == "") {
    cls = "";
  }
  $(`
  <nav class="breadcrumbs">
  <a href="index.html" class="breadcrumbs__item">Home</a>
  <a href="#" class="breadcrumbs__item is-active">Class ${cls}</a>
  </nav>
  `).insertBefore("#body-wrapper");
}

onload = () => {
  setSideBar();
  setSubjectCards();
};

function openClassPage(cls) {
  window.location.href = `subjects.html?class=${cls}`;
}

function goToHomePage() {
  window.location.href = "index.html";
}

function setSideBar() {
  let userName = JSON.parse(localStorage.getItem('UserInfo')).user.userName;
  $('#userName').text(userName);
  let classes = getClasses();
  classes.forEach((cls) => {
    $(".nav-links").append(`
        <li class="nav-items" id="class-${cls}" onclick="openClassPage(${cls})">Class ${cls}</li>
        `);
  });
  $(`#class-${cls}`).addClass("active");
}
