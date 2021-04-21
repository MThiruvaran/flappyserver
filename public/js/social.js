// https://www.facebook.com/sharer.php?u=[post-url]
// https://twitter.com/share?url=[post-url]&text=[post-title]&via=[via]&hashtags=[hashtags]
// https://api.whatsapp.com/send?text=[post-title] [post-url]

let facebookButton = document.querySelector(".facebook-btn");
const twitterButton = document.querySelector(".twitter-btn");
const whatsappButton = document.querySelector(".whatsapp-btn");

function init() {
  let postUrl = "https://flappygame.herokuapp.com/";
  let postTitle = "check out the new game";

  facebookButton.setAttribute(
    "href",
    `https://www.facebook.com/sharer.php?u=${postUrl}`
  );

  twitterButton.setAttribute(
    "href",
    `https://twitter.com/share?url=${postUrl}&text=${postTitle}`
  );

  whatsappButton.setAttribute(
    "href",
    `https://api.whatsapp.com/send?text=${postTitle} ${postUrl} `
  );
}

init();
