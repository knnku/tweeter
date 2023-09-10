/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

$(document).ready(function () {
  const data = [
    {
      user: {
        name: "Newton",
        avatars: "https://i.imgur.com/73hZDYK.png",
        handle: "@SirIsaac",
      },
      content: {
        text: "If I have seen further it is by standing on the shoulders of giants",
      },
      created_at: 1461116232227,
    },
    {
      user: {
        name: "Descartes",
        avatars: "https://i.imgur.com/nlhLi3I.png",
        handle: "@rd",
      },
      content: {
        text: "Je pense , donc je suis",
      },
      created_at: 1461113959088,
    },
  ];

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

  const $renderTweets = function (tweets) {
    for (let tweet of tweets) {
      const $tweet = createTweetElement(tweet);
      $(".tweets-container").append($tweet);
    }
  };

  // Hardcode Render Tweets
  // $renderTweets(data);

  // Capture tweet data on form(button) submmit
  const $tweetFormSubmit = $("#tweet-submit");
  $($tweetFormSubmit).on("submit", function (event) {
    event.preventDefault();
    // console.log("Tweet form submitted!");
    // console.log($(this));

    const $data = $(this).serialize();
    $.post("/tweets", $data);
  });

  const $loadTweets = function () {
    $.get("/tweets", function (data, status) {
      $renderTweets(data);
    });
  };

  $loadTweets();
});
