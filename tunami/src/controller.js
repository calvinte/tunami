var tunami = tunami || {};

tunami.controller = function($scope) {
  var audio = _.first(document.getElementsByTagName('audio'));
  $scope.lists = tunami._lists;
  $scope.playing = {};
  $scope.playingFrom = {};
  $scope.addZip = function() {
    event.target.addEventListener('change', function() {
      var files = this.files;
      tunami.utility.loadZipAsList(files[0], function(List) {
        List.activate();
        $scope.$apply();
      });
      this.removeEventListener('change', arguments.callee);
    });
  }
  $scope.removeList = function(List) {
    if ($scope.playingFrom === List) $scope.setActiveSong();
    List.destroy();
  }
  $scope.removeSong = function(Song, List) {
    List.removeSong(Song);

    // If the song we removed is currently playing, reset the active song.
    if ($scope.playing === Song) $scope.setActiveSong();
  }
  $scope.activateList = function(List) { List.activate() }
  $scope.setActiveSong = function(Song, List) {
    var element = document.createElement('source');

    // Stop any audio from playing, and remove all sources.
    audio.pause();
    audio.innerHTML = '';
    if (audio.currentTime) audio.currentTime = 0;
    audio.load();
    if (!Song) return;

    $scope.playing = Song;
    $scope.playingFrom = List;
    List.activate();

    Song.play(audio, element, _.throttle(function(current, total) {
      var percent = Math.round(current / total * 100) + '% ';
      $scope.progress = percent + Song.name;
      $scope.$apply();
    }, 250), function() { return Song === $scope.playing });
  }
}

