var tunami = tunami || {};

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
  unpackSongsFromZip: function unpackZip(file, callback) {
    tunami.utility.getFileAsBlob(file, function(blob) {
      var worker = new Worker('../src/worker.unpackZip.js');
      worker.addEventListener('message', function(e) {
        var i, file, song, songs, url;
        if (e.data.message == 'complete') {
          songs = [];
          for (i in e.data.zip.files) {
            file = e.data.zip.files[i];
            url = tunami.utility.getBlobAsDataUrl(file.blob);
            try {
              song = new tunami.Song(file.name, url, file.extension);
              songs.push(song);
            } catch(e) {}
          }
          callback(songs);
        }
      }, false);
      worker.postMessage({blob: blob});
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

