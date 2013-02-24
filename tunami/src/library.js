var tunami = tunami || {};
var requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
tunami.library = new tunami.List('library');

requestFileSystem(TEMPORARY, tunami.utility.fsSize, function(fs) {
  var dirName = tunami.library.name, options;
  function readFiles(directory) {
    tunami.library.directory = directory;
    directory.createReader().readEntries(function(entries) {
      for (var i in entries) tunami.library.importZip(entries[i]);
    });
  }
  
  options = {create: true, exclusive: false};
  fs.root.getDirectory(dirName, options, readFiles, readFiles);
});

tunami.library.getArchive = function(index, callback) {
  var options = {create: true, exclusive: false};
  var filename = 'part-' + index;
  tunami.library.directory.getFile(filename, options, function(fileEntry) {
    callback(fileEntry);
  });
}

tunami.library.listArchives = function(index, callback) {
  tunami.library.directory.createReader().readEntries(function(entries) {
    var i, entry, archives = [];
    for (i in entries) {
      entry = entries[i];
      archives.push({
        index: parseInt(entry.filename),
        fileEntry: entry
      });
    }
    callback(archives);
  });
}

