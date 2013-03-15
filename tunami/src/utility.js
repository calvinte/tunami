var tunami = tunami || {};
var requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;

tunami.utility = {
  extensions: ['m4p', 'mp3', 'm4a', 'aac', 'mp4', 'ogg'],
  fsSize: 4 * 1024 * 1024 * 1024,
  salt: function() { return Math.floor(new Date().getTime() * Math.random()) },
  confirmValidFileName: function confirmValidFileName(name) {
    var valid;

    // Ignore dotfiles and paths that include `__`.
    valid = name.indexOf('.') != 0;
    valid = valid && name.indexOf('__') != 0;
    valid = valid && name.indexOf('/.') == -1;
    return valid;
  },
  sanitizeFileName: function(name) {
    name = name.replace(/\.(?=.*?\.)|\//g, '-');
    return name;
  },
  getExtensionFromFileName: function getExtensionFromFileName(string) {
    return _.last(string.split('.'));
  },
  getMimeTypeFromExtension: function getMimeTypeFromExtension(extension) {
    var audioTypes = {
      m4a: 'audio/mpeg',
      m4p: 'audio/mpeg',
      aac: 'audio/mpeg',
      mp4: 'audio/mpeg',
      mp3: 'audio/mpeg',
      ogg: 'audio/ogg'
    }
    return audioTypes[extension];
  },
  /**
   * @param elements as Array.
   * @param child as HTMLElement or Event.
   * @return Boolean.
   */
  elementsHaveChild: function elementHasChild(elements, child) {
    var element, i = 0;

    // Condition allows function to accept Event objects.
    if (child instanceof Event) child = child.target;

    for (i; i < elements.length; i++) {
      element = elements[i];
      var node = child.parentNode;
      while (node != null) {
        if (node === element) {
          return true;
        }
        node = node.parentNode;
      }
    }
    return false;
  }
};

