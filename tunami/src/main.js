document.addEventListener('DOMContentLoaded', function() {
  var audio = document.getElementsByTagName('audio')[0];
  var ChooseEntryOptions = {
    type: 'openFile',
    accepts: [{
      extensions: ['mp3', 'm4a', 'aac', 'mp4', 'ogg']
    }]
  };
  chrome.fileSystem.chooseEntry(ChooseEntryOptions, function(fileEntry){

    tunami.utility.getFileAsDataURL(fileEntry, function(url) {
      var extension = _.last(fileEntry.name.split('.'));
      var audioTypes = {
        m4a: 'audio/mpeg',
        aac: 'audio/mpeg',
        mp4: 'audio/mpeg',
        mp3: 'audio/mpeg',
        ogg: 'audio/ogg'
      }
      var source = document.createElement('source');
      source.type = audioTypes[extension];
      source.src = url;
      audio.appendChild(source);
    });
  });
});

