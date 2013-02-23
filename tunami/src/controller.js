var tunami = tunami || {};

tunami.controller = function($scope) {
  var audio = _.first(document.getElementsByTagName('audio'));
  $scope.lists = [];
  $scope.playing = {};
  $scope.addZip = function() {
    event.target.addEventListener('change', function() {
      var files = this.files;
      tunami.utility.loadZipAsList(files[0], function(list) {
        $scope.lists.push(list);
        $scope.$apply();
      });
      this.removeEventListener('change', arguments.callee);
    });
  }
  $scope.removeList = function(List) {
    // @TODO better way of managing lists, we shouldn't have to do data
    // manipulation like this in the controller.
    for (var i in List.songs) {
      if ($scope.playing === List.songs[i]) $scope.setActiveSong();
    }
    $scope.lists = _.reject($scope.lists, function(v) { return v === List });
  }
  $scope.removeSong = function(Song, List) {
    List.removeSong(Song);

    // If the song we removed is currently playing, reset the active song.
    if ($scope.playing === Song) $scope.setActiveSong();
  }
  $scope.setActiveSong = function(song) {
    var element = document.createElement('source');

    // Stop any audio from playing, and remove all sources.
    audio.pause();
    audio.innerHTML = '';
    if (audio.currentTime) audio.currentTime = 0;
    audio.load();
    if (!song) return;

    song.play(audio, element, _.throttle(function(current, total) {
      var percent = Math.round(current / total * 100) + '% ';
      $scope.progress = percent + song.name;
      $scope.$apply();
    }, 250), function() { return song === $scope.playing });

    $scope.playing = song;
  }
}

