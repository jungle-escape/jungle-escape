var Wingstop = pc.createScript("wingstop");

// initialize code called once per entity
Wingstop.prototype.initialize = function () {
  this.entity.collision.on("collisionstart", this.onCollisionStart, this);
};

Wingstop.prototype.onCollisionStart = function (hit) {
  if (hit.other.tags.has("player")) {
    if (this.entity.parent.name === "wing") {
      this.entity.parent.parent.script.movementPropellerStart.stop = true;
    } else {
      this.entity.parent.parent.parent.script.movementPropellerStart.stop = true;
    }
    setTimeout(
      function () {
        this.entity.tags.clear();
        this.entity.parent.tags.clear();
      }.bind(this),
      1000
    );
  }
};
