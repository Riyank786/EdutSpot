let url = window.location.href;
url = new URL(url);
let cls = url.searchParams.get("class");
let subject = url.searchParams.get("subject");
let chapter = url.searchParams.get("chapter");
let content;
let videoId;
let qTypeToPost;
let qIdToPost;
let questionData = [];
let userId = JSON.parse(localStorage.getItem('UserInfo')).user._id;

// get request to url
function httpGet(theUrl) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open("GET", theUrl, false);
  xmlHttp.send(null);
  return xmlHttp.responseText;
}

// modal handling
var modal = document.getElementById("addQuestionModal");
var span = document.getElementsByClassName("close")[0];
var queInput = document.getElementById("que-input");

var ansModal = document.getElementById("addAnswerModal");
var ansSpan = document.getElementsByClassName("close")[1];
var ansInput = document.getElementById("ans-input");

function openModal(qType) {
  modal.style.display = "flex";
  queInput.focus();

  qTypeToPost = qType
};

let queContainerId;
let ansContainerId;
let queIndex;
function openAnsModal(queFilterId, queId, ansId, index){
  ansModal.style.display = "flex";
  ansInput.focus();
  qIdToPost = queFilterId;  
  queContainerId = queId;
  ansContainerId = ansId;
  queIndex = index;
}

span.onclick = function () {
  modal.style.display = "none";
  queInput.value = "";
};
ansSpan.onclick = function () {
  ansModal.style.display = "none";
  ansInput.value = "";
};

window.onclick = function (event) {
  if (event.target == modal || event.target ==  ansModal) {
    ansModal.style.display = "none";
    ansInput.value = "";
    modal.style.display = "none";
    queInput.value = "";
  }
};

// ------------------------ post request to add question ------------------------ //
async function addQuestionsToDb(data) {
  let url = " https://edu-spot.herokuapp.com/addQuestion";
  var xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(JSON.stringify(data));
  xhr.onload = function () {
    if (xhr.status != 200) {
      console.log(`Error ${xhr.status} : ${xhr.statusText}`);
    } else {
     if (xhr.response == "question added") {
        toastr['success']('Question added');
        setQuestions(data.videoId);
      }
    }
  };
}

// ------------------------ add Question function ------------------------ //
async function addQuestion() {
  let queToAdd = queInput.value;
  if (!queToAdd || queToAdd == "") {
    toastr['warning']("Question should not be empty");
    return;
  }

  let data = {
    class: cls,
    subject: subject,
    chapterName: chapter,
    videoId: videoId,
    qType: qTypeToPost,
    question : {
      question: queToAdd,
      userId: userId,
    },
    answers: []
  };

  await addQuestionsToDb(data);

  modal.style.display = "none";
  queInput.value = "";
}

// ------------------------ post request to add answer ------------------------ //
async function addAnswerToDb(data) {
  
  let url = " https://edu-spot.herokuapp.com/addAnswer";
  var xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(JSON.stringify(data));
  xhr.onload = function () {
    if (xhr.status != 200) {
      console.log(`Error ${xhr.status} : ${xhr.statusText}`);
    } else {
      toastr['success']('Answer added');
      questionData[queIndex].answers = [];
      questionData[queIndex].answers = [...JSON.parse(xhr.response)];
      handleClick(queContainerId, ansContainerId, queIndex);
    }
  };
}

// ------------------------ add Answer function ------------------------ //
async function addAnswer() {
  let ansToAdd = ansInput.value;
  if (!ansToAdd || ansToAdd == "") {
    toastr['warning']("Answer should not be empty");
    return;
  }

  let data = {
    id: qIdToPost,
    answer : {
      answer: ansToAdd,
      userId: userId,
    }
  };

  await addAnswerToDb(data);

  ansModal.style.display = "none";
  ansInput.value = "";
}



function setVideoNContent(index){
  let currentData = content[0].videos[index];
  $("#video-frame").attr('src', currentData.link+'?autoplay=1');
  $("#summary h3").text(currentData.title);
  $("#summary p").text(currentData.summary);
  $(".video-link").removeClass('video-link-active');
  $(`#video-${index}`).addClass('video-link-active');  
  videoId = currentData._id;
  openContent("summary", "summary");
  setQuestions(currentData._id);
}

function setVideoList(videos) {
  videos.forEach((video, index) => {
    $("#video-list").append(`
    <li class="video-link" id="video-${index}" onclick="setVideoNContent('${index}')">
    ${index + 1}. ${video.title}.
  </li>
    `);
  });
}

function getTimeDiff(timeStart){
  let timeEnd = new Date();
  timeStart = new Date(timeStart);

  var hourDiff = timeEnd - timeStart;
  var minDiff = hourDiff / 60 / 1000;
  var hDiff = hourDiff / 3600 / 1000;
  var humanReadable = {};
  humanReadable.hours = Math.floor(hDiff);
  humanReadable.minutes = Math.floor(minDiff - 60 * humanReadable.hours);
  if(humanReadable.hours > 24){
    let day = Math.floor(humanReadable.hours / 24);
    if(day > 1)
      return `${day} days`;
    else{
      return `${day} day`
    } 
  }
  if(humanReadable.hours > 0){
    if(humanReadable.hours > 1)
      return `${humanReadable.hours} hours`;
    else 
      return `${humanReadable.hours} hour`;
  } else{
    if(humanReadable.minutes > 1){
      
      return `${humanReadable.minutes} minutes`;
    } else{
      return `${humanReadable.minutes} minute`;
    }
  }
}

function setQuestions(videoId){
  let url = ` https://edu-spot.herokuapp.com/fetchQnA?videoId=${videoId}`;
  let questions = JSON.parse(httpGet(url));

  openQuestions('imp-que-wrapper', 'imp-que-detail-page')
  openQuestions('pre-que-wrapper', 'pre-que-detail-page')
  openQuestions('chpt-que-wrapper', 'chpt-que-detail-page')

  $('.que-container').empty();
  if(questions.length == 0){
    $('.que-container').append(`
      <h4>No questions for this video. Ask first question.</h4>
    `)
  }
  let queId; let ansId; let queCon;
  questionData = [];
  questions.forEach((que, index) => {
    questionData.push(que);
    let postedTime = que.createdAt;
    postedTime = getTimeDiff(postedTime);
    if(que.qType == 'important'){
      queId = 'imp-que-wrapper';
      ansId = 'imp-que-detail-page';
      queCon = 'imp-que-container';
    } else if(que.qType == 'previous'){
      queId = 'pre-que-wrapper';
      ansId = 'pre-que-detail-page';
      queCon = 'pre-que-container';
    } else if(que.qType == 'chapter'){
      queId = 'chpt-que-wrapper';
      ansId = 'chpt-que-detail-page';
      queCon = 'chpt-que-container';
    }
    $(`#${queCon}`).append(`
      <div class="que-card" onclick="openAnswers('${queId}', '${ansId}'); handleClick('${queId}', '${ansId}', ${index})">
        <h4 class="que">${que.question.question}</h4>
        <div class="que-desc">
        <div class="desc">
        <p><b>Posted by : </b>${que.question.userName}</p>
        <p><i>${postedTime} ago</i></p>
      </div>
      <div class="ans-icon">
        <p><i class="fa fa-comments-o"></i> ${que.answers.length}</p>
        </div>
        </div>
      </div>
    `)
  });

}

function handleClick(queId, ansId, index){
  let que = questionData[index];
  let answers = que.answers;
  let question = que.question.question;
  let queFilterId = que._id;
  
  $(`#${ansId}`).empty();
  
  if(answers.length == 0){
    $(`#${ansId}`).append(`
      <div class="tabcontent-header">
        <h3>Important Q&A</h3>
        <button class="addAnsBtn" onclick="openAnsModal('${queFilterId}', '${queId}', '${ansId}', ${index})">Add answer</button>
      </div>
      <button class="backBtn" onclick="openQuestions('${queId}', '${ansId}')">Back to all Qeustions</button>
      <h4>${question}</h4>
      <h4>No answers for this question. Be the first to add answer for this question.</h4>
    `);
  } else{
    $(`#${ansId}`).append(`
      <div class="tabcontent-header">
        <h3>Important Q&A</h3>
        <button class="addAnsBtn" onclick="openAnsModal('${queFilterId}', '${queId}', '${ansId}', ${index})">Add answer</button>
      </div>
      <button class="backBtn" onclick="openQuestions('${queId}', '${ansId}')">Back to all Qeustions</button>
      <h4>${question}</h4>
      <h4>Answers</h4>
    `)
    answers.forEach(ans => {

      let postedTime = ans.createdAt;
      postedTime = getTimeDiff(postedTime);

      $(`#${ansId}`).append(`
        <div class="ans-card">
          <div class="ans">${ans.answer}</div>
          <div class="ans-desc">
            <p><b>Posted by : </b>${ans.userName}</p>
            <p><i>${postedTime} ago</i></p>
          </div>
        </div>
      `)
    });
  }
}

function goToHomePage(){
  window.location.href = 'index.html';
}

function showVideoList(){
    $('#closeVideoList').css('display','flex');
    $('#video-list').css({
      "right":"10px", 
      'z-index':'9999999',
      transition: "all 0.5s",
    });
}

function hideVideoList(){
    $('#closeVideoList').css('display','none');
    $('#video-list').css({
      "right":"-300px", 
      transition: "all 0.5s",
    });
}

function getContentData(){
  let queURL = ` https://edu-spot.herokuapp.com/content?class=${cls}&subject=${subject}&chapterName=${chapter}`;
  let data = JSON.parse(httpGet(queURL));
  return data;
}

onload = () => {
  let userName = JSON.parse(localStorage.getItem('UserInfo')).user.userName;
  $('#userName').text(userName);
  content = getContentData();
  setVideoList(content[0].videos);
  setVideoNContent(0);
  $("#bradcrum").append(`
  <nav class="breadcrumbs">
  <a href="index.html" class="breadcrumbs__item">Home</a>
  <a href="subjects.html?class=${cls}" class="breadcrumbs__item">Class ${cls}</a>
  <a href="chapters.html?class=${cls}&subject=${subject}" class="breadcrumbs__item">${subject}</a>
  <a href="#" class="breadcrumbs__item is-active">${chapter}</a>
  </nav>
  `);
  
  $(".nav-links").append(`
  <a href="subjects.html?class=${cls}" style="text-decoration:none; color:black;"><li class="nav-items">Class ${cls}</li></a>
  <a href="chapters.html?class=${cls}&subject=${subject}" style="text-decoration:none; color:black;"><li class="nav-items">${subject}</li></a>
`);

};
