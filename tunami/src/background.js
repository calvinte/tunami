var tunami = tunami || {};

/*
 * Application launch listener.
 */
chrome.app.runtime.onLaunched.addListener(function() {
  var options = {width: 1200, height: 800};
  var callback = function(indexWindow) {
    indexWindow.contentWindow.tunami = tunami;
  }
  chrome.app.window.create('index.html', options, callback);
});

