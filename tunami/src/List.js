var tunami = tunami || {};

tunami._lists = [];
tunami.List = Class.extend({
  init: function(name, songs) {
    this.name = name;
    this.songs = songs;
    tunami._lists.push(this);
  },
  removeSong: function(Song) {
    this.songs = _.reject(this.songs, function(v) { return v === Song });
  },
  activate: function() {
    for (i in tunami._lists) tunami._lists[i].active = false;
    this.active = true;
  },
  destroy: function() {
    tunami._lists = _.reject(tunami._lists, function(v) { return v === this });
  }
});

