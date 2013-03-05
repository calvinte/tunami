var tunami = tunami || {};
var requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
zip.workerScriptsPath = '../lib/zip/';

tunami.utility = {
  extensions: ['m4p', 'mp3', 'm4a', 'aac', 'mp4', 'ogg'],
  fsSize: 4 * 1024 * 1024 * 1024,
  createTempFile: function(callback, salt) {
    salt = salt || Math.floor(new Date().getTime() * Math.random());
    var tmp = '_tmp' + salt;
    requestFileSystem(TEMPORARY, tunami.utility.fsSize, function(fs) {
      function createFile() {
        fs.root.getFile(tmp, {create: true}, function(FileEntry) {
          callback(FileEntry);
        });
      }

      fs.root.getFile(tmp, null, function(fileEntry) {
        fileEntry.remove(createFile, createFile);
      }, createFile);
    });
  },

  getZipEntryAsDataURL: function (zipEntry, callback) {
    tunami.utility.createTempFile(function(FileEntry) {
      var writer = new zip.FileWriter(FileEntry),
          complete = function(blob) { callback(FileEntry.toURL()) },
          progress = new tunami.progressQueue.Item(zipEntry.filename);
      zipEntry.getData(writer, complete, progress);
    }, zipEntry.crc32);
  },
  confirmValidFileName: function confirmValidFileName(name) {
    var valid;

    // Ignore dotfiles and paths that include `__`.
    valid = name.indexOf('.') != 0;
    valid = valid && name.indexOf('__') != 0;
    valid = valid && name.indexOf('/.') == -1;
    return valid;
  },
  sanitizeFileName: function(name) {
    name = name.replace(/\.(?=.*?\.)|\//g, '-');
    return name;
  },
  readZip: function readZip(file, callback, onError) {
    zip.createReader(new zip.BlobReader(file), function(zipReader) {
      zipReader.getEntries(function(entries) {
        callback(entries);
      });
    }, onError);
  },
  loadZipAsList: function unpackZip(file, callback) {
    List = new tunami.List(file.name);
    List.importZip(file, callback);
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

