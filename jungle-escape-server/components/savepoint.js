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
    var name = this.entity.name;
    if (name === "savepoint1") {
      if (target.savepoint1) {
        return;
      }
      target.savepoint1 = true;
    } else if (name === "savepoint2") {
      if (target.savepoint2) {
        return;
      }
      target.savepoint2 = true;
    } else if (name === "savepoint3") {
      if (target.savepoint3) {
        return;
      }
      target.savepoint3 = true;
    } else if (name === "savepoint4") {
      if (target.savepoint4) {
        return;
      }
      target.savepoint4 = true;
    }

    var pos = this.entity.getPosition();
    target.savePoint = pos;
    target.collisionTags.push("savepoint");
    // this.entity.enabled = false;
  }
};
