let count = 1;
$("body > div > div.header > img").click(function () {
  // console.log($(window).width());
  if ($(window).width() < 574) {
    $("body > div > div.header > div.menu > a").html(
      "<img src='/images/logout.png'></img>"
    );
  } else {
    $("body > div > div.header > div.menu > a").html("Log Out");
  }
  count++;
  if (count % 2 == 0) {
    $("body > div > div.header > div.menu").css("opacity", "1");
    $("body > div > div.header > div.menu").css("display", "flex");
    // $("body > div > div.header > div.menu").addClass("revealMenu");
    // $("body > div > div.header > div.menu").removeClass("hideMenu");
  } else {
    $("body > div > div.header > div.menu").css("opacity", "0");
    $("body > div > div.header > div.menu").css("display", "none");
    // $("body > div > div.header > div.menu").removeClass("revealMenu");
    // $("body > div > div.header > div.menu").addClass("hideMenu");
  }
});
let count1 = 1;
$("body > div > div.header > div.menu").click(function () {
  count1++;
  if (count1 % 2 == 0) {
    $("body > div > div.header > div.menu").css("opacity", "1");
    $("body > div > div.header > div.menu").css("display", "flex");
    // $("body > div > div.header > div.menu").removeClass("hideMenu");
    // $("body > div > div.header > div.menu").addClass("revealMenu");
  } else {
    $("body > div > div.header > div.menu").css("opacity", "0");
    $("body > div > div.header > div.menu").css("display", "none");
    // $("body > div > div.header > div.menu").removeClass("revealMenu");
    // $("body > div > div.header > div.menu").addClass("hideMenu");
  }
});
function search() {
  $("body > div > div.content > ul").css("display", "flex");
  var searchInput = document.getElementById("searchInput").value;
  console.log(searchInput);
  if (searchInput == "") {
    $("body > div > div.content > ul").css("display", "none");
  }

  var xhr = new XMLHttpRequest();
  xhr.open("GET", "/search?q=" + encodeURIComponent(searchInput), true); //sending the searching query dynamically as the user types and fetching the result i.e. the matching songs
  xhr.onload = function () {
    if (xhr.status === 200) {
      let results = JSON.parse(xhr.responseText).data;
      let data1 = JSON.parse(xhr.responseText).data1;
      // console.log("here", results);
      // As it's an XML request so we are getting value in this js file so we have to use "append" method to update the ejs file with the new data but remember to clear the previous data before updating with the new data
      // Here as i have to use ejs tags inside the strings which i'm appending in the ejs file so i can't directly write ejs tags in the string as it will treat them as strings so i have to separately use the ejs tags and append the html iteratively while using "data1"
      $("body > div > div.content > ul").empty();
      results.forEach((element) => {
        $("body > div > div.content > ul").append(`
        <li class="${element.id}">
        <div class="info">
          <div class="teacherInfo">
            <h2>${element.name}</h2>
          </div>
          <h4 class="topic">${element.project_title}</h4>
        </div>
        <div class="scores ${element.id}score">
          <form action="/scoring" method="post" id="grid-form">
            <label for="criteriaHeading">Criteria</label>
            <label for="Criteria">C1</label>
            <label for="Criteria">C2</label>
            <label for="Criteria">C3</label>
            <label for="Criteria">C4</label>
            <label for="Criteria">C5</label>`);
      });
      results.forEach((element, index) => {
        data1.forEach((element1) => {
          if (element.id == element1.teacher_id) {
            $("body > div > div.content > ul li #grid-form")
              .append(`<label for="name">${element1.name}</label>
            <input type="number" name="Criteria1" required />
            <input type="number" name="Criteria2" required />
            <input type="number" name="Criteria3" required />
            <input type="number" name="Criteria4" required />
            <input type="number" name="Criteria5" required />`);
          }
        });
        if (index == results.length - 1) {
          $("body > div > div.content > ul li #grid-form")
            .append(`<button type="submit">Submit</button>
              </form>
            </div>
          </li>`);
        }
      });
    }
  };
  xhr.send();
}
if ($(".flag1").text() == "true") {
  setTimeout(() => {
    alert("Group Marked!");
  }, 100);
}
$("body").on("mouseenter", "div > div.content > ul li", function () {
  //To ensure that dynamically updated <li> elements are recognized when using jQuery's click function, you can use event delegation. Event delegation allows you to attach an event handler to a parent element that will fire for all matching descendant elements now and in the future, including dynamically added ones.
  // console.log(this.classList.value);
  $(`.${this.classList.value + "score"}`).css("display", "flex");
  $("body div > div.content > ul li").not(this).css("opacity", "0.3");
  $("body div > div.content > ul li").not(this).css("pointer-events", "none");
});
$("body").on("mouseleave", "div > div.content > ul li", function () {
  // console.log(this.classList.value);
  $(`.${this.classList.value + "score"}`).css("display", "none");
  $("body div > div.content > ul li").not(this).css("opacity", "1");
  $("body div > div.content > ul li").not(this).css("pointer-events", "auto");
});
