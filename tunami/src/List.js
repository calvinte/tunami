var tunami = tunami || {};

tunami._lists = [];
tunami.List = Class.extend({
  init: function(name, files, callback) {
    this.name = name;
    this.songs = [];
    files = files || [];
    for (var i = 0; i < files.length; i++) this.addSong(files[i]);
    tunami._lists.push(this);
    if (callback) callback(this);
  },
  addSong: function(File) {
    this.songs.push(new tunami.Song(File));
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
  importList: function(List) {
    this.songs = _.union(this.songs, List.songs);
  },
  importEntryArray: function(EntryArray) {
    var i, FileEntry, List = this;
    for (i = 0; i < EntryArray.length; i++) {
      FileEntry = EntryArray[i];
      FileEntry.file(function(File) {
        List.addSong(File);
      });
    }
  }
});

