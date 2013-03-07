var tunami = tunami || {};
var requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
tunami.library = new tunami.ZipList('library');
tunami.library.str = {
  PREP_WRITE_LIBRARY: 'Preparing to write library to the disk.',
  WRITE_LIBRARY: 'Writing library to disk.',
  ADDING: function(str) { return 'Adding `' + str + '`.' },
}

requestFileSystem(PERSISTENT, tunami.utility.fsSize, function(fs) {
  var dirName = tunami.library.name, self = tunami.library;
  function readFiles(directory) {
    self.directory = directory;
    self.listArchives(function(archives) {
      if (!archives.length) return;
      (function recurse(i) {
        var archive = archives[i];
        var FileEntry = archives[i].FileEntry;

        FileEntry.file(function(File) {
          archive.fs.root.importZip(new zip.BlobReader(File), function() {
            self.importZip(File);
            if (++i < archives.length) recurse(i);
          }, function(e) { tunami.library.createArchive(i) });
        });
      })(0);
    });
  }

  options = {create: true, exclusive: false};
  fs.root.getDirectory(dirName, options, readFiles, readFiles);
});

tunami.library.listArchives = function(callback) {
  var self = this;
  this.directory.createReader().readEntries(function(entries) {
    var i, entry, archives = [];
    for (i = 0; i < entries.length; i++) {
      entry = entries[i];
      exists = !!(_.find(self._archives, function(v) {
        return v.FileEntry.name == entry.name;
      }));
      if (exists) continue;
      new tunami.library.Archive({FileEntry: entry});
    }
    callback(tunami.library._archives);
  });
}

tunami.library.addSongToArchive = function(Song, archive, callback) {
  var self = this;
  tunami.utility.createTempFile(function(FileEntry) {
    var writer = new zip.FileWriter(FileEntry);
    var complete = function(blob) {
      var name = tunami.utility.sanitizeFileName(Song.name);
      archive.fs.root.addBlob(name, blob);
      callback();
    };
    var progress = new tunami.progressQueue.Item(self.str.ADDING(Song.name));
    Song.entry.getData(writer, complete, progress);
  });
}

tunami.library.saveArchive = function(archive) {
  var self = this;
  archive.FileEntry.createWriter(function(fileWriter) {
    var exportProgress = new tunami.progressQueue.Item(self.str.PREP_WRITE_LIBRARY),
        writerProgress = new tunami.progressQueue.Item(self.str.WRITE_LIBRARY);
    fileWriter.onprogress = writerProgress;

    archive.fs.root.exportBlob(function(Blob) {
      fileWriter.write(Blob);
    }, exportProgress, function(e) { throw(e) });
  });
}

tunami.library.createArchive = function(index, callback) {
}

tunami.library.importList = function(List) {
  this.songs = _.union(this.songs, List.songs);
  (function getArchives(self) {
    tunami.library.listArchives(function(archives) {
      var songIndex = 0,
          completedSongIndex = 0,
          consecutiveSongsThreshold = 8,
          archiveIndex = 0,
          song,
          archive;
      if (!archives.length) {
        new self.Archive({callback: getArchives});
        return;
      }
      archive = archives[archiveIndex];
      (function recurse(Song) {
        function getNext() {
          // Do a couple of these simultaneously.
          if (songIndex - completedSongIndex < consecutiveSongsThreshold) {
            var next = List.songs[++songIndex];
            if (next) recurse(next);
          }
        }
        getNext();
        self.addSongToArchive(Song, archive, function(e) {
          if (List.songs.length == ++completedSongIndex) {
            // Save the archive, once we're finished.
            tunami.library.saveArchive(archive)
          } else getNext();
        });
      })(List.songs[songIndex]);
    });
  })(this);
}
 
