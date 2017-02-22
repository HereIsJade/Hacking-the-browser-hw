//Captures the visible area of the currently active tab and opens a new window showing the screenshot.

chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.tabs.captureVisibleTab({format: 'jpeg'}, function(dataUrl) {
    console.log('got capture');
    window.open(dataUrl);
  });
});
