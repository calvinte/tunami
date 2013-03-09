var tunami = tunami || {};

tunami.Song = Class.extend({
  init: function(File) {
    this.File = File;
    this.name = this.File.name;
    this.extension = tunami.utility.getExtensionFromFileName(this.name);
    this.type = tunami.utility.getMimeTypeFromExtension(this.extension);
    if (tunami.utility.extensions.indexOf(this.extension) == -1) {
      throw new Error('Unacceptable extension');
    }
    if (!tunami.utility.confirmValidFileName(this.name)) {
      throw new Error('Invalid filename');
    }
  },
  getUrl: function(callback) {
    var Song = this;
    if (!this.url) {
      var reader = new FileReader();
      reader.onloadend = function(e) {
        Song.url = e.target.result;
        callback();
      }
      reader.onprogress = new tunami.progressQueue.Item(this.name);
      reader.readAsDataURL(this.File);
    } else {
      callback();
    }
  },
  play: function(audio, source, validator) {
    var song = this;
    this.getUrl(function() {
      // Make sure the user hasn't clicked another title while we were away.
      if (!validator()) return;

      source.type = song.type;
      source.src = song.url;
      audio.appendChild(source);
      audio.play();
    });
  }
});

