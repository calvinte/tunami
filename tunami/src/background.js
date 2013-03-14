var tunami = tunami || {};

/*
 * Application launch listener.
 */
chrome.app.runtime.onLaunched.addListener(function() {
  var options = {width: 1200, height: 800};
  var callback = function(indexWindow) {
    indexWindow.contentWindow.tunami = tunami;
    tunami.indexWindow = indexWindow.contentWindow;
    window.dispatchEvent(new CustomEvent('index_launch'));
  };
  chrome.app.window.create('index.html', options, callback);
});

