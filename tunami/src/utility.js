var tunami = tunami || {};

tunami.utility = {
  getFileAsDataURL: function getFileAsDataURL(fileEntry, callback) {
    fileEntry.file(function(fileEntry) {
      var reader = new FileReader();
      reader.onload = function(e) { callback(e.target.result) };
      reader.readAsDataURL(fileEntry);
    });
  }
};

