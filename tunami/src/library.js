var tunami = tunami || {};
var requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
tunami.library = new (tunami.List.extend({
  init: function() {
    this._super('library');
  },
  importList: function(List) {
    var songs = List.songs, self = this, i = 0;
    this._super(List);
    (function recurse() {
      var Song = songs[i++];
      if (!Song) return;
      self.directory.getFile(Song.name, {create: true}, function(FileEntry) {
        FileEntry.createWriter(function(FileWriter) {
          FileWriter.onprogress = new tunami.progressQueue.Item(this.name);
          FileWriter.onwriteend = recurse;
          FileWriter.write(Song.File);
        });
      });
    })()
  }
}))();

requestFileSystem(PERSISTENT, tunami.utility.fsSize, function(fs) {
  var dirName = tunami.library.name, self = tunami.library;
  function readFiles(directory) {
    self.directory = directory;
    var dirReader = directory.createReader();
    var entries = [];
    (function readEntries() {
      dirReader.readEntries (function(EntryArray) {
        if (EntryArray.length) {
          self.importEntryArray(EntryArray)
          readEntries();
        } else tunami.library.activate();
      });
    })();
  }

  options = {create: true, exclusive: false};
  fs.root.getDirectory(dirName, options, readFiles, readFiles);
});

