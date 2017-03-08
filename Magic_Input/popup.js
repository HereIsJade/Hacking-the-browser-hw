function submit() {
  var thoughts = $("#thoughts").val();
  chrome.runtime.sendMessage({
        greeting: thoughts
      },
      function(response) {
        $("#div").text(response.msg);
      });
}

$("#submit").on("click", submit);
