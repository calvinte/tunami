var tunami = tunami || {};

tunami.controller = function($scope) {
  $scope.songs = [];
  $scope.playing = {};
  $scope.addSong = function() {
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
        var source = {
          type: audioTypes[extension],
          src: url
        };
        $scope.songs.push({
          name: fileEntry.name,
          source: source
        });
        $scope.$apply();
      });
    });
  }
  $scope.removeSong = function(song) {
    $scope.songs = _.reject($scope.songs, function(value) {
      return value === song;
    });

    // If the song we removed is currently playing, reset the active song.
    if ($scope.playing === song) $scope.setActiveSong();
  }
  $scope.setActiveSong = function(song) {
    var audio = document.getElementsByTagName('audio')[0];
    var element = document.createElement('source');
    audio.pause();
    audio.innerHTML = '';
    if (!song) return;

    $scope.playing = song;
    element.type = song.source.type;
    element.src = song.source.src;
    audio.appendChild(element);
  }
}

