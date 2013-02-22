var tunami = tunami || {};
var requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
zip.workerScriptsPath = '../lib/zip/';

tunami.utility = {
  extensions: ['m4p', 'mp3', 'm4a', 'aac', 'mp4', 'ogg'],
  getFileAsDataURL: function getFileAsDataURL(file, callback) {
    file.file(function(file) {
      var reader = new FileReader();
      reader.onload = function(e) { callback(e.target.result) };
      reader.readAsDataURL(file);
    });
  },
  getBlobAsDataUrl: function getBlobAsDataUrl(blob) {
    var url = URL.createObjectURL(blob);
    return url;
  },
  getFileAsBlob: function getFileAsBlob(file, callback) {
    file.file(function(file) {
      var reader = new FileReader();
      reader.onload = function(e) { callback(e.target.result) };
      reader.readAsBinaryString(file);
    });
  },
  getZipEntryAsDataURL: function(entry, callback, progress) {
    var writer, zipFileEntry;

    var tmpFilename = '_tmp' + entry.crc32;
    requestFileSystem(TEMPORARY, 4 * 1024 * 1024 * 1024, function(filesystem) {
      function create() {
        filesystem.root.getFile(tmpFilename, {create : true},
          function(zipFile) {
            writer = new zip.FileWriter(zipFile);
            entry.getData(writer, function(blob) {
              var blobURL = zipFile.toURL();
              callback(blobURL);
            }, function(current, total) {
              if (progress) progress(Math.round(current / total * 100) + '% ' + entry.filename);
            });
        });
      }

      filesystem.root.getFile(tmpFilename, null, function(entry) {
        entry.remove(create, create);
      }, create);
    });
  },
  unpackSongsFromZip: function unpackZip(file, callback) {
    zip.createReader(new zip.BlobReader(file), function(zipReader) {
      zipReader.getEntries(function(entries) {
        entries.forEach(function(entry) {
          var name, type, extension, valid;
          name = entry.filename;

          // Ignore dotfiles and paths that include `__`.
          valid = name.indexOf('.') != 0;
          valid = valid && name.indexOf('__') != 0;
          valid = valid && name.indexOf('/.') == -1;
          if (!valid) {
            // Cut file from entries.
            entries = _.reject(entries, function(value) { 
              return value === entry;
            });
            return;
          }

          extension = tunami.utility.getExtensionFromFileName(name);
          try {
            song = new tunami.Song(name, entry, extension);
            callback(song);
          } catch(e) {}
        });
      });
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

