var tunami = tunami || {};
var requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
zip.workerScriptsPath = '../lib/zip/';

tunami.utility = {
  extensions: ['m4p', 'mp3', 'm4a', 'aac', 'mp4', 'ogg'],
  fsSize: 4 * 1024 * 1024 * 1024,
  getZipEntryAsDataURL: function getZipEntryAsDataURL(zipEntry, callback, progress) {
    var tmp = '_tmp' + zipEntry.crc32;
    requestFileSystem(TEMPORARY, tunami.utility.fsSize, function(fs) {
      function createFile() {
        fs.root.getFile(tmp, {create : true}, function(zipFile) {
          var writer = new zip.FileWriter(zipFile);
          var complete = function(blob) { callback(zipFile.toURL()) };
          zipEntry.getData(writer, complete, progress);
        });
      }

      fs.root.getFile(tmp, null, function(fileEntry) {
        fileEntry.remove(createFile, createFile);
      }, createFile);
    });
  },
  confirmValidFileName: function confirmValidFileName(name) {
    var valid;

    // Ignore dotfiles and paths that include `__`.
    valid = name.indexOf('.') != 0;
    valid = valid && name.indexOf('__') != 0;
    valid = valid && name.indexOf('/.') == -1;
    return valid;
  },
  readZip: function readZip(file, callback) {
    zip.createReader(new zip.BlobReader(file), function(zipReader) {
      zipReader.getEntries(function(entries) {
        callback(entries);
      });
    });
  },
  unpackSongsFromZip: function unpackZip(file, callback) {
    tunami.utility.readZip(file, function(entries) {
      var i;
      for (i in entries) {
        var entry, name, type, extension;
        entry = entries[i];
        name = entry.filename;

        try {
          song = new tunami.Song(name, entry);
          callback(song);
        } catch(e) {}
      }
    });
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
  }
};

