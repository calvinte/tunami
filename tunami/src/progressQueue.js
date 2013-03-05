(function() {
  var queue = {};
  tunami.progressQueue = queue;
  queue.changed = false;
  queue.items = [];
  queue.removeItem = function(item) {
    var items = queue.items,
        i = queue.items.indexOf(item);
    queue.items.splice(i, 1);
    queue.changed = true;
  };
  queue.Item = function ProgressQueueItem(string) {
    var item = this;
    return function(current, total) {
      if (current instanceof ProgressEvent) {
        total = current.total;
        current = current.loaded;
      }
      var percent = Math.round(current / total * 100) + '% ';
      var exists = queue.items.indexOf(item) == -1 ? true: false;
      queue.changed = true;
      item.progress = percent + string;
      if (exists) queue.items.push(item);
      if (current == total) queue.removeItem(item);
    }
  }
})();

