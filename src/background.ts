chrome.runtime.onInstalled.addListener(({reason}) => {
  if (reason === chrome.runtime.OnInstalledReason.INSTALL) {
    chrome.tabs.create({
      url: "html/welcome.html"
    });
  }
})

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.command === "closeTab") {
    chrome.tabs.remove(sender.tab.id, function() {
      sendResponse({result: "Tab closed"});
    });
    return true;
  }
});