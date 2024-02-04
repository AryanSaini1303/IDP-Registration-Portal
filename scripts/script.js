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
  var searchInput = document.getElementById("searchInput").value;
  // console.log(searchInput);
  
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "/search?q=" + encodeURIComponent(searchInput), true); //sending the searching query dynamically as the user types and fetching the result i.e. the matching songs

  xhr.onload = function () {
    if (xhr.status === 200) {
      let results = JSON.parse(xhr.responseText);
      // console.log("here", results);
      // As it's an XML request so we are getting value in this js file so we have to use "append" method to update the ejs file with the new data but remember to clear the previous data before updating with the new data 
      $("body > div.wrapper > div.content > ul").empty();
      results.forEach((element) => {
        $("body > div.wrapper > div.content > ul").append(`
        <li>
            <div class="info">
              <div class="teacherInfo">
                <h2>${element.name}</h2>
              </div>
              <h4 class="topic">${element.project_title}</h4>
            </div>
            <div class="scores">
              <ul>
              <a href="/scoring/?q1=${element.name}&q2=1"><li class="num1">1</li></a>
              <a href="/scoring/?q1=${element.name}&q2=2"><li class="num2">2</li></a>
              <a href="/scoring/?q1=${element.name}&q2=3"><li class="num3">3</li></a>
              <a href="/scoring/?q1=${element.name}&q2=4"><li class="num4">4</li></a>
              <a href="/scoring/?q1=${element.name}&q2=5"><li class="num5">5</li></a>
              <a href="/scoring/?q1=${element.name}&q2=6"><li class="num6">6</li></a>
              <a href="/scoring/?q1=${element.name}&q2=7"><li class="num7">7</li></a>
              <a href="/scoring/?q1=${element.name}&q2=8"><li class="num8">8</li></a>
              <a href="/scoring/?q1=${element.name}&q2=9"><li class="num9">9</li></a>
              <a href="/scoring/?q1=${element.name}&q2=10"><li class="num10">10</li></a>
              </ul>
            </div>
          </li>`);
      });
    }
  };
  xhr.send();
}
if($(".flag1").text()=='true'){
  setTimeout(() => {
    alert("Group Marked!");
  }, 100);
}