importScripts('../lib/jszip.js');
importScripts('../lib/jszip-load.js');
importScripts('../lib/jszip-deflate.js');
importScripts('../lib/jszip-inflate.js');
importScripts('../lib/underscore.min.js');
importScripts('utility.js');

self.addEventListener('message', function(e) {
  var zip, i, file, type, extension, valid;
  zip = new JSZip(e.data.blob);
  for (i in zip.files) {
    file = zip.files[i];

    // Ignore dotfiles and paths that include `__`.
    valid = file.name.indexOf('.') != 0;
    valid = valid && file.name.indexOf('__') != 0;
    valid = valid && file.name.indexOf('/.') == -1;
    if (!file.data.length || !valid) {
      delete zip.files[i];
      continue;
    }

    extension = tunami.utility.getExtensionFromFileName(file.name);
    type = tunami.utility.getMimeTypeFromExtension(extension);
    file.blob = new Blob([file.asArrayBuffer()], {type: type});
    file.extension = extension;
  }
  self.postMessage({message: 'complete', zip: zip});
});

