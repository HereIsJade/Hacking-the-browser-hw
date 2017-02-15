console.log("content running");
// $("div").css({'background-color': 'lightgreen'});

var a = ["https://data.whicdn.com/images/227403738/large.jpg", "https://68.media.tumblr.com/baf339a0ffcab91dbb8287ae6cc5bd6a/tumblr_nz42r5K0SC1uiuqwto1_400.png", "https://s-media-cache-ak0.pinimg.com/originals/bb/53/04/bb530402ae1d7032bc2ce280b803eb61.jpg", "https://data.whicdn.com/images/182418032/large.jpg", "https://data.whicdn.com/images/192455253/large.jpg"];
$("img").attr({
  src: "https://68.media.tumblr.com/e5f387fa3f7aacefb3ca4ea66a523641/tumblr_o8mld6Ynkv1uiuqwto1_500.gif",
  width: "max-width:100%",
  height: "auto"
});

$("div").css("background-color", "#94D0FF");

$("img").hover(function() {
  $(this).attr("src", a[Math.floor(Math.random() * a.length)])
}, function() {
  alert("Huh? You just don't give up trying.")
});

$("span:contains('$')").text("$ INFINITY").css({
  color: "#FF6AD5",
  width: "100%"
}).css("font-family", "Arial Black");
