/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

$(document).ready(function () {
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
    const $tweetOutput = `
      <article class="tweet">
        <header>

          <div class="tweet-user">
            <div class="tweet-useravatar">
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
            <i class="fa-solid fa-heart"></i>
          </div>
        </footer>
      </article>`;

    return $tweetOutput;
  };

  //Error template for empty threats
  const $tweetErr1 = `<i class="fa-solid fa-triangle-exclamation"></i>Empty tweets are not allowed.<i class="fa-solid fa-triangle-exclamation"></i></label>`;

  //Error templates for too much threats
  const $tweetErr2 = `<i class="fa-solid fa-triangle-exclamation"></i>This tweet is too long!<i class="fa-solid fa-triangle-exclamation"></i></label>`;

  //Capture & POST tweet data on form(button) submmit
  const $tweetForm = $("#tweet-submit");
  $($tweetForm).on("submit", function (event) {
    //Banish error
    $(".tweet-error").slideUp("fast");

    event.preventDefault();
    const $checkTweet = $("#tweet-text").val();

    //Checks---->
    //Check form if empty
    if ($checkTweet === "") {
      $(".tweet-error").slideDown("fast", function () {
        $(this).css("display", "block").html($tweetErr1);
      });
      return;
    }
    //Check if tweet is long
    if ($checkTweet.length > 140) {
      $(".tweet-error").slideDown("fast", function () {
        $(this).css("display", "block").html($tweetErr2);
      });
      return;
    }

    const $data = $(this).serialize();

    $.post("/tweets", $data, function () {
      // Clear the tweet input field
      $("#tweet-text").val("");

      // Clear the existing tweets container and reload tweets
      // $(".tweets-container").empty();
      $loadLastTweet();
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
      let $tweet;
      for (let i = 0; i < data.length; i++) {
        $tweet = createTweetElement(data[data.length - 1]);
      }
      $(".tweets-container").prepend($tweet);
    });
  };

  //Initial tweet load
  $loadTweets();
});
