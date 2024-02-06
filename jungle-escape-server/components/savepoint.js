var Savepoint = pc.createScript("savepoint");

// initialize code called once per entity
Savepoint.prototype.initialize = function () {
  this.entity.collision.on("triggerenter", this.onTriggerEnter, this);
};

Savepoint.prototype.swap = function (old) {
  this.entity.collision.off("triggerenter", old.onTriggerEnter, old);
};

Savepoint.prototype.onTriggerEnter = function (target) {
  // Set player savepoint
  if (target.tags.has("player")) {
    var pos = this.entity.getPosition();
    target.savePoint = pos;
    target.collisionTags.push("savepoint");
    this.entity.enabled = false;
  }
};
