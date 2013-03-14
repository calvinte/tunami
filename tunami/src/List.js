var tunami = tunami || {};

tunami._lists = [];
tunami.List = Class.extend({
  init: function(name, files, callback) {
    var List = this;
    this.name = name;
    this.songs = [];
    files = files || [];
    for (var i = 0; i < files.length; i++) this.addSong(files[i]);
    tunami._lists.push(this);
    if (callback) callback(this);

    this.contextMenuItems = [];
    this.contextMenuItems.push(new tunami.contextMenu.Item(
      File.name,
      'Remove this song',
      function(event) {
        List.removeSong(_.find(List.songs, function(Song) {
          return tunami.utility.elementsHaveChild(Song.elements, event.target);
        }));
      },
      function(event) {
        return tunami.utility.elementsHaveChild(List.elements, event.target);
      }
    ));
  },
  elements: [],
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

