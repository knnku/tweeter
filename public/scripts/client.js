/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

$(document).ready(function () {
  //Show return to top button when window scrolling
  $(window).on("scroll", () => {
    if ($(window).scrollTop() + 600 > $(window).height()) {
      $(".scroll-up button").fadeIn("fast");
    } else {
      $(".scroll-up button").fadeOut("slow");
    }
  });

  //Show return to top button when in element scrolling
  $("main").on("scroll", () => {
    if ($("main").scrollTop() + 600 > $(window).height()) {
      $(".scroll-up button").fadeIn("fast");
    } else {
      $(".scroll-up button").fadeOut("slow");
    }
  });

  //Scroll to top button
  $(".scroll-up").on("click", () => {
    $(window).scrollTop({ top: 0, behavior: "smooth" });
    $("main").scrollTop({ top: 0, behavior: "smooth" });
  });

  // Tweet form collapse Toggle
  $(".nav-new-tweet").on("click", () => {
    $(".new-tweet").slideToggle("fast");
    $("#tweet-text").focus();
  });

  //XSS Escape for template literal tweet structure
  const escape = function (str) {
    let div = document.createElement("div");
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  };

  //Build Tweet Structure
  const createTweetElement = function (tweet) {
    const { name, avatars, handle } = tweet.user;
    const tweetText = tweet.content.text;
    const timestamp = tweet.created_at;
    const likes = Math.floor(Math.random() * 100);
    const $tweetOutput = `
      <article class="tweet">
        <header>

          <div class="tweet-user">
            <div>
              <img src="${avatars}">
            </div>
            <div class="username">
              ${name}
            </div>
          </div>

          <div class="tweet-usertag">
            ${handle}
          </div>
        </header>

        <p>
          ${escape(tweetText)}
        </p>

        <footer>
          <div class="tweet-timestamp">
            ${$.timeago(timestamp)}
          </div>
          <div class="tweet-icons">
            <i class="fa-solid fa-flag"></i>
            <i class="fa-solid fa-repeat"></i>
            <i class="fa-solid fa-heart"><label class="likes">${likes}</label></i>
          </div>
        </footer>
      </article>`;

    return $tweetOutput;
  };

  //Error template for empty threats
  const $emptyTweetErr = `<label><i class="fa-solid fa-triangle-exclamation"></i>Empty tweets are not allowed!<i
        class="fa-solid fa-triangle-exclamation"></i></label>`;

  //Error templates for too much threats
  const $longTweetErr = `<label><i class="fa-solid fa-triangle-exclamation"></i>This tweet is too long!<i class="fa-solid fa-triangle-exclamation"></i></label>`;

  //Error templates for something wierd
  const $wierdErr = `<label><i class="fa-solid fa-triangle-exclamation"></i>Uh oh, something went wrong.<i class="fa-solid fa-triangle-exclamation"></i></label>`;

  //Capture & POST tweet data on form(button) submmit
  const $tweetForm = $("#tweet-submit");
  $($tweetForm).on("submit", function (event) {
    event.preventDefault();

    //Banish error if exists
    $(".tweet-error").slideUp("fast");

    //Check form if empty
    const $checkTweet = $("#tweet-text").val();
    if ($checkTweet === "") {
      $(".tweet-error").html($emptyTweetErr).slideDown("easing");
      return;
    }
    //Check if tweet is long
    if ($checkTweet.length > 140) {
      $(".tweet-error").html($longTweetErr).slideDown("easing");
      return;
    }

    const $data = $(this).serialize();

    $.post("/tweets", $data)
      .done(function () {
        // Reset input field and counter
        $("#tweet-text").val("");
        $(".counter").val("140").css("color", "");

        // Load last tweet
        $loadLastTweet();
      })
      .fail(function (xhr, status, error) {
        $(".tweet-error").html($wierdErr).slideDown("easing");
      });
  });

  //Loop through tweets JSON in tweets data route
  const $renderTweets = function (tweets) {
    for (let i = 0; i < tweets.length; i++) {
      const $tweet = createTweetElement(tweets[i]);
      $(".tweets-container").prepend($tweet);
    }
  };

  //Load tweets from tweets data route via GET
  const $loadTweets = function () {
    $.get("/tweets", function (data, status) {
      $renderTweets(data);
    });
  };

  //Load last tweet upon user submission
  const $loadLastTweet = function () {
    $.get("/tweets", function (data, status) {
      let $tweet = createTweetElement(data[data.length - 1]);
      $(".tweets-container").prepend($tweet);
    });
  };

  //Initial tweet load
  $loadTweets();
});
