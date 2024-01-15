let count = 1;
$("body > div > div.header > img").click(function() {
  // console.log($(window).width());
  if($(window).width()<574){
    $("body > div > div.header > div.menu > a").html("<img src='/images/logout.png'></img>")
  }
  else{
    $("body > div > div.header > div.menu > a").html("Log Out")
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
$("body > div > div.header > div.menu").click(function() {
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