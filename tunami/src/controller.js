var tunami = tunami || {};

tunami.controller = function($scope) {
  var audio = _.first(document.getElementsByTagName('audio'));
  var render = function() { if (!$scope.$$phase) $scope.$apply() }
  tunami.update = render;
  $scope.lists = tunami._lists;
  $scope.library = tunami.library;
  $scope.progressQueue = tunami.progressQueue;
  $scope.progressQueue.interval = setInterval(function() {
    if ($scope.progressQueue.changed) {
      $scope.progressQueue.changed = false;
      render();
    }
  }, 250);
  $scope.playing = {};
  $scope.playingFrom = {};
  $scope.addZip = function() {
    event.target.addEventListener('change', function() {
      var files = this.files;
      new tunami.ZipList(files[0], function(List) {
        List.activate();
        render();
      });
      this.removeEventListener('change', arguments.callee);
    });
  }
  $scope.removeList = function(List) {
    if ($scope.playingFrom === List) $scope.setActiveSong();
    List.destroy();
    $scope.lists = tunami._lists;
    render();
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

    Song.play(
      audio,
      element,
      function() { return Song === $scope.playing }
    );
  }
}

