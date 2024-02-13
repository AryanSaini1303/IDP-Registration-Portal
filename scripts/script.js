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
      results.forEach((element, index) => {
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
            // console.log(element1);
            // Find the li element with the matching id
            const liElement = $("." + element.id);
            // Check if the li element exists
            if (liElement.length > 0) {
              // Append the form to the found li element
              liElement.find("#grid-form")
                .append(`<label for="name">${element1.name}</label>
                    <input type="hidden" name="student_ids" value="${element1.id}" />
                    <input type="number" name="Criteria1" />
                    <input type="number" name="Criteria2" />
                    <input type="number" name="Criteria3" />
                    <input type="number" name="Criteria4" />
                    <input type="number" name="Criteria5" />`);
                    //in above form we are sending input which is hidden from the user i.e. "student_ids"
            }
          }
        });
        if (index == results.length - 1) {
          $("body > div > div.content > ul li #grid-form")
            .append(`<button type="submit" class="btn">Submit</button>
            <button type="button" class="close btn" style="background-color:red">Close</button>
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
let clickCount = 1;
$("body").on("click", "div > div.content > ul li", function () {
  clickCount++;
  // console.log(clickCount);
  if ($(`.${this.classList.value + "score"}`).css("display") == "flex") {
    clickCount++;
  }
  //To ensure that dynamically updated <li> elements are recognized when using jQuery's click function, you can use event delegation. Event delegation allows you to attach an event handler to a parent element that will fire for all matching descendant elements now and in the future, including dynamically added ones.
  if (clickCount % 2 == 0) {
    $(`.${this.classList.value + "score"}`).css("display", "flex");
    $("body div > div.content > ul li").not(this).css("opacity", "0.3");
    $("body div > div.content > ul li").not(this).css("pointer-events", "none");
    if ($(`.${this.classList.value + "score *"}`).length == 9) {
      clickCount--;
      // $(`.${this.classList.value + "score #grid-form"}`).css("display", "none");
      $(`.${this.classList.value + "score"}`).css("display", "none");
      $("body div > div.content > ul li").not(this).css("opacity", "1");
      $("body div > div.content > ul li")
        .not(this)
        .css("pointer-events", "auto");
      alert("No students found in this group!");
    }
  }
  $("body").on("click", "div > div.content > ul li .close", function () {
    // const parentClass = $(this).parent().parent().parent().attr("class")[7];
    const parentClass = $(this).parent().parent().parent().attr("class");
    // console.log(parentClass);
    $(`.${parentClass + "score"}`).css("display", "none");
    $("body div > div.content > ul li").not(this).css("opacity", "1");
    $("body div > div.content > ul li").not(this).css("pointer-events", "auto");
  });
});
