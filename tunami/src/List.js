var tunami = tunami || {};

tunami.List = Class.extend({
  init: function(name, songs) {
    this.name = name;
    this.songs = songs;
  },
  removeSong: function(Song) {
    this.songs = _.reject(this.songs, function(v) { return v === Song });
  }
});

