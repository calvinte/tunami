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
  importList: function(List) {
    this.songs = _.union(this.songs, List.songs);
  }
});

tunami.ZipList = tunami.List.extend({
  init: function(file, callback) {
    var List = this;
    if (typeof file == 'string') {
      this._super(file);
    } else {
      this._super(file.name);
      this.importZip(file, callback);
    }

    // Archive sub-class. Needs to inherit `List`.
    this._archives = [];
    this.Archive = Class.extend({
      /**
       * @param options as Object with paramaters:
       *  FileEntry (optional)
       *  callback as Function (optional)
       */
      init: function(options) {
        options = options || {};
        // Currently this only works for library, will update.
        this.fs = new zip.fs.FS();
        List._archives.push(this);
        if (options.FileEntry) {
          this.FileEntry = options.FileEntry;
          this.index = this.getArchiveIndexFromName(this.FileEntry.name);
        } else {
          List.listArchives(function(archives) {
            var fileName = this.getArchiveNameFromIndex(archives.length++);
            this.directory.getFile(fileName, {create: true}, function(entry) {
              this.FileEntry = entry;
              if (options.callback) options.callback();
            }, function() {
              throw new Error('Could not create new archive ' + filename);
            });
          });
        }
      },
      getArchiveNameFromIndex: function(index) {
        return 'part-' + index + '.zip';
      },
      getArchiveIndexFromName: function(name) {
        return parseInt(name.replace(/[^0-9]/g, ''));
      }
    });
  },
  importZip: function(file, callback, onError) {
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
      if (callback) callback(self);
    }, onError);
  },
});

