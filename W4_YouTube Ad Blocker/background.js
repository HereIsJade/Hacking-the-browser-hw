function callback(details) {
  var method = details.method;
  var type = details.type;
  var url = details.url;
  console.log(method, type, url);

  if (type === 'sub_frame') {
    return { redirectUrl: chrome.extension.getURL('show.html')};
    console.log("type subframe:"+details.type);
    console.log("details:"+details);
  }
}

var filter = {
  urls: ['<all_urls>'],
  types:["sub_frame"]
};

var extraInfo = ['blocking'];

chrome.webRequest.onBeforeRequest.addListener(
  callback, filter, extraInfo);
