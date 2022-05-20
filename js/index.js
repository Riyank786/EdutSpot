function openClassPage(cls) {
  window.location.href = `subjects.html?class=${cls}`;
}
onload = () => {
  let userName = JSON.parse(localStorage.getItem('UserInfo')).user.userName;
  $('#userName').text(userName);
  classes = getClasses();
  classes.forEach((cls) => {
    $(".nav-links").append(`
            <li class="nav-items" id="class-${cls}" onclick="openClassPage(${cls})">Class ${cls}</li>
        `);
  });
};
