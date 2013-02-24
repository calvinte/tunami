var tunami = tunami || {};

tunami._lists = [];
tunami.List = Class.extend({
  init: function(name, songs) {
    this.name = name;
    this.songs = songs || [];
    tunami._lists.push(this);
  },
  removeSong: function(Song) {
    this.songs = _.reject(this.songs, function(v) { return v === Song });
  },
  activate: function() {
    for (i in tunami._lists) tunami._lists[i].active = false;
    this.active = true;
  },
  destroy: function() {
    var self = this;
    tunami._lists = _.reject(tunami._lists, function(v) { return v === self });
  },
  importZip: function(file, callback) {
    var self = this;
    tunami.utility.readZip(file, function(entries) {
      for (var i in entries) {
        var entry, name, type, extension;
        entry = entries[i];
        name = entry.filename;

        try {
          song = new tunami.Song(name, entry);
          self.songs.push(song);
        } catch(e) {}
      }
      callback(self);
    });
  },
  importList: function(List) {
    this.songs = _.union(this.songs, List.songs);
  }
});

