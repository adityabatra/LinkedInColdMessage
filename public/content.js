/*global chrome*/
function extractLinkedInData() {
  const name = document.querySelector('.text-heading-xlarge')?.innerText;
  const title = document.querySelector('.text-body-medium')?.innerText;
  const about = document.querySelector('.display-flex.ph5.pv3 .inline-show-more-text')?.innerText;
  const recentPost = document.querySelector('.feed-shared-update-v2__description')?.innerText;
console.log(name, title, about, recentPost);
  return { name, title, about, recentPost };
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "extractData") {
    sendResponse(extractLinkedInData());
  }
});
