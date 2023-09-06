$(document).ready(function() {
  // --- our code goes here ---

  console.log("Dom is loaded: ready!");

  $("#tweet-text").on('keypress', function() {
    console.log(this);
  })

});




