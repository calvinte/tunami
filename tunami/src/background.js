/*
 * Application launch listener.
 */
chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('index.html', {width: 1200, height: 800});
});

