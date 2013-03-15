var tunami = tunami || {};

tunami.ngModule = angular.module('tunami', [])
  .directive('attachSong', function() {
    return function(scope, element, attrs) {
      if (scope.Song.elements.indexOf(element[0]) == -1) {
        scope.Song.elements.push(element[0]);
      }
    }
  })
  .directive('attachList', function() {
    return function(scope, element, attrs) {
      if (scope.List.elements.indexOf(element[0]) == -1) {
        scope.List.elements.push(element[0]);
      }
    }
  });

tunami.controller = function($scope) {
  var audio = _.first(document.getElementsByTagName('audio'));
  var render = function() { if (!$scope.$$phase) $scope.$apply() }
  tunami.scope = $scope;
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
  $scope.createList = function() {
    event.target.addEventListener('change', function() {
      var files = this.files;
      new tunami.List('New List', files, function(List) {
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
  $scope.renameList = function(List) {
    List.name = $scope.renameListValue;
    render();
  }
  $scope.songSelectBehaviour = function(Song, List) {
    // Logic controls multi-select behaviour.
    if (event.metaKey) {
      Song.ngSelected = !!Song.ngSelected;
    } else if (event.shiftKey) {
      // Pressing shift.
      var i = List.songs.indexOf($scope.lastSongSelected);
      var direction = List.songs.indexOf(Song) > i;
      if (i == -1) return;
      for (i; i < List.songs.length; i += (direction ? 1 : -1)) {
        List.songs[i].ngSelected = true;
        if (List.songs[i] === Song) break;
      }
    } else {
      // Not pressing and modifier keys.
      var i = 0;
      for (i; i < List.songs.length; i++) {
        if (List.songs[i] === Song) List.songs[i].ngSelected = true;
        else List.songs[i].ngSelected = false;
      }
    }
    if (Song.ngSelected) $scope.lastSongSelected = Song;
  }
  $scope.removeSong = function(Song, List) {
    List.removeSong(Song);

    // If the song we removed is currently playing, reset the active song.
    if ($scope.playing === Song) $scope.setActiveSong();
  }
  $scope.activateList = function(List) { List.activate() }
  $scope.setActiveSong = function(Song, List) {
    var element = document.createElement('source');

    if (event.metaKey || event.shiftKey) {
      Song.ngSelected = !Song.ngSelected;
      $scope.songSelectBehaviour(Song, List);
      return;
    }
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

