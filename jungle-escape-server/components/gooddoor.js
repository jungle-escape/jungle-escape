var Gooddoor = pc.createScript("gooddoor");

// initialize code called once per entity
Gooddoor.prototype.initialize = function () {
  this.entity.rigidbody.type = pc.BODYTYPE_STATIC;
  this.entity.collision.on("collisionstart", this.onCollisionStart, this);
};

Gooddoor.prototype.onCollisionStart = function (hit) {
  if (hit.other.tags.has("player")) {
    this.entity.rigidbody.type = pc.BODYTYPE_DYNAMIC;
    hit.other.collisionTags.push("p1_right");
  }
};

Gooddoor.prototype.swap = function (old) {
  this.entity.collision.off("collisionstart", old.onCollisionStart, old);
  this.entity.collision.on("collisionstart", this.onCollisionStart, this);
};

// // update code called every frame
// Gooddoor.prototype.update = function (dt) {};

// swap method called for script hot-reloading
// inherit your script state here
// Gooddoor.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/
