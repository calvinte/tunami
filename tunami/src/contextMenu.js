var tunami = tunami || {};
tunami.contextMenu = {
  items: [],
  Item: Class.extend({
    init: function(title, validator, callback) {
      var menu = tunami.contextMenu;
      menu.items.push(this);
      this.salt = tunami.utility.salt();
      this.title = title;
      this.validator = validator;
      this.callback = callback;
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
      }
    }
    chrome.contextMenus.onClicked.addListener(function(info) {
      _.find(tunami.contextMenu.items, function(Item) {
        return Item.salt == info.menuItemId
      }).callback(event);
      chrome.contextMenus.onClicked.removeListener(arguments.callee);
    });
  });
});

