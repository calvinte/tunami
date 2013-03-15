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
        function(event) { return List.hasElement(event.target) },
        function(event) {
          var Song = _.find(List.songs, function(Song) {
            return Song.hasElement(event.target);
          });
          List.removeSong(Song);
          tunami.update();
      }),
      new tunami.contextMenu.Item(
        'Remove Selected Songs',
        function(event) {
          var songs = List.getSelectedSongs();
          return List.hasElement(event.target) && songs.length > 1;
        },
        function(event) {
          var songs = List.getSelectedSongs();
          for (var i = 0; i < songs.length; i++) List.removeSong(songs[i]);
          tunami.update();
      })
    ]
  },
  hasElement: function(element) {
    return tunami.utility.elementsHaveChild(this.elements, element);
  },
  getSelectedSongs: function() {
    return _.filter(this.songs, function(Song) { return Song.ngSelected });
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

