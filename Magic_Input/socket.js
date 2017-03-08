//try arrow function later
var Socket = function() {
  window.socket = this;

  this.port = chrome.runtime.connect({name:"popupToBackground"});

  chrome.runtime.onConnect.addListener(function(port) {
      if(port.name == "backgroundToPopup") {}
      else if(port.name == "popupToBackground") {
        window.socket.port = chrome.extension.connect({name:"backgroundToPopup"});
      }
      else {
          return;
      }

      port.onMessage.addListener(function(msg) {
          try {
              window[msg.namespace][msg.literal][msg.method].apply(this, msg.args);
          }
          catch(error) {
              // your failed action goes here.
          }
      });
  });
};
