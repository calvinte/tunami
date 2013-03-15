var tunami = tunami || {};
tunami.contextMenu = {
  items: [],
  Item: Class.extend({
    init: function(title, callback, validator) {
      var menu = tunami.contextMenu;
      menu.items.push(this);
      this.salt = tunami.utility.salt();
      this.title = title;
      this.callback = callback;
      this.validator = validator;
    }
  })
};

window.addEventListener('index_launch', function() {
  var window = tunami.indexWindow;
  window.document.addEventListener('contextmenu', function(event) {
    var menu = tunami.contextMenu, i = 0, item;
    chrome.contextMenus.removeAll();
    for (i = 0; i < menu.items.length; i++) {
      item = menu.items[i];
      if (item.validator(event)) {
        chrome.contextMenus.create({
          contexts: ['all'],
          id: item.salt.toString(),
          title: item.title
        });
        (function(item, event) {
          chrome.contextMenus.onClicked.addListener(function(info) {
            if (info.menuItemId == item.salt) item.callback(event);
            chrome.contextMenus.onClicked.removeListener(arguments.callee);
          });
        })(item, event);
      }
    }
  });
});
