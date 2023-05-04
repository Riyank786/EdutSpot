let url = window.location.href;
url = new URL(url);
let subject = url.searchParams.get("subject");
let cls = url.searchParams.get("class");

let urls = ` http://localhost:3000/chapter?class=${cls}&subject=${subject}`;
function httpGet(theUrl) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open("GET", theUrl, false);
  xmlHttp.send(null);
  return xmlHttp.responseText;
}

function openSubjectPage(subject) {
  window.location.href = `chapters.html?class=${cls}&subject=${subject}`;
}

function setSideBar() {
  let subjectList = getSubjects(cls);
  subjectList.forEach((subject) => {
    $(".nav-links").append(`
        <li class="nav-items" id="subject-${subject}" onclick="openSubjectPage('${subject}')">${subject}</li>
        `);
  });
  $(`#subject-${subject}`).addClass("active");
}

function goToHomePage() {
  window.location.href = "index.html";
}

function goToLearningPage(chapter) {
  window.location.href = `content.html?class=${cls}&subject=${subject}&chapter=${chapter}`;
}

function setChapterCard() {
  let chapters = JSON.parse(httpGet(urls));
  
  let imgLink = "";
  switch (subject) {
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
  chapters.forEach((chapter, index) => {
    $("#body-wrapper").append(` 
            <div class="card">
                <div class="chapter-image">
                    <img src="${imgLink}" alt="Integer" height="100%" width="100%">
                </div> 
                <div class="chapter-desc">
                    <h4>${chapter.chapterName}</h4>
                    <p>${chapter.videos} ${chapter.videos > 1 ? "videos" : "video"
      }</p>
                    <button ${chapter.videos == 0 ? 'disabled' : ''}  class='goToLearningPageBtn' id='${index}'>Start Learning</button>
                </div>
            </div>
        `);
  });

  $('.goToLearningPageBtn').click((e)=>{
    let id = e.target.id;
    goToLearningPage(chapters[id].chapterName);
  });

  if (!subject || subject == null || subject == "") {
    subject = "Subject";
    cls = "";
  }
  $(`
    <nav class="breadcrumbs">
    <a href="index.html" class="breadcrumbs__item">Home</a>
    <a href="subjects.html?class=${cls}" class="breadcrumbs__item">Class ${cls}</a>
    <a href="#" class="breadcrumbs__item is-active">${subject}</a>
    </nav>
  `).insertBefore("#body-wrapper");
}

onload = () => {
  let userName = JSON.parse(localStorage.getItem('UserInfo')).user.userName;
  $('#userName').text(userName);
  setSideBar();
  setChapterCard();
};
