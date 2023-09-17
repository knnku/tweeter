$(document).ready(function () {
  // --- our code goes here ---

  //Tweet character counter
  $("#tweet-text").on("input", function () {
    let tweetCount = $(this).val().length;
    let target = $(this).parent().find(".counter");

    let remainingCharacters = 140 - tweetCount;
    target.val(remainingCharacters);

    //Red
    if (remainingCharacters < 0) {
      target.css("color", "red");
    } else {
      target.css("color", "");
    }
  });
});
