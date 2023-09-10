/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

$(document).ready(function () {
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
          ${tweetText}
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

  //Loop through tweets JSON in tweets data route
  const $renderTweets = function (tweets) {
    for (let i = tweets.length - 1; i >= 0; i--) {
      const $tweet = createTweetElement(tweets[i]);
      $(".tweets-container").append($tweet);
    }
  };

  //Capture & POST tweet data on form(button) submmit
  const $tweetForm  = $("#tweet-submit");
  $($tweetForm).on("submit", function (event) {
    const $data = $(this).serialize();
    $.post("/tweets", $data);

    $("#tweet-text").val("");
    event.preventDefault();
  });

  //Load tweets from tweets data route via GET
  const $loadTweets = function () {
    $.get("/tweets", function (data, status) {
      $renderTweets(data);
    });
  };

  $loadTweets();
});
