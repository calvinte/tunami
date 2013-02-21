var tunami = tunami || {};

tunami.Song = Class.extend({
  init: function(name, url, extension) {
    var type = tunami.utility.getMimeTypeFromExtension(extension);
    if (tunami.utility.extensions.indexOf(extension) == -1) {
      throw new Error('Unacceptable extension');
    }
    this.name = name;
    this.source = {
      type: type,
      src: url
    }
  }
});

