function submit() {
  var thoughts = $("#thoughts").val();
  chrome.runtime.sendMessage({
        greeting: thoughts
      },
      function(response) {
        $("#div").text(response.msg).css('color', 'red');
      });
}

$("#submit").on("click", submit);
