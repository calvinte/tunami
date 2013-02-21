var tunami = tunami || {};
window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;

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
  unpackZipFromFile: function unpackZip(file, callback) {
    tunami.utility.getFileAsBlob(file, function(blob) {
      var zip = new JSZip(blob);
      callback(zip);
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

