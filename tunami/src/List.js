var tunami = tunami || {};

tunami._lists = [];
tunami.List = Class.extend({
  init: function(name, files, callback) {
    var List = this;
    this.name = name;
    this.songs = [];
    this.elements = [];
    files = files || [];
    for (var i = 0; i < files.length; i++) this.addSong(files[i]);
    tunami._lists.push(this);
    if (callback) callback(this);

    this.contextMenuItems = [
      new tunami.contextMenu.Item(
        'Remove This Song',
        function(event) {
          var Song = _.find(List.songs, function(Song) {
            return tunami.utility.elementsHaveChild(Song.elements, event.target);
          });
          List.removeSong(Song);
          tunami.update();
        },
        function(event) {
          return tunami.utility.elementsHaveChild(List.elements, event.target);
        }
      ),
      new tunami.contextMenu.Item(
        'Remove Selected Songs',
        function(event) {
          var songs = _.filter(List.songs, function(Song) {
            return Song.ngSelected
          });
          for (var i = 0; i < songs.length; i++) List.removeSong(songs[i]);
          tunami.update();
        },
        function(event) {
          var songs = _.filter(List.songs, function(Song) {
            return Song.ngSelected
          });
          if (songs.length < 2) return false;
          return tunami.utility.elementsHaveChild(List.elements, event.target);
        }
     )
    ]
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

