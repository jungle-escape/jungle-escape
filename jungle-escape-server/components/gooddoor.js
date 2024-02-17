var Gooddoor = pc.createScript("gooddoor");

// initialize code called once per entity
Gooddoor.prototype.initialize = function () {
  this.entity.rigidbody.type = pc.BODYTYPE_STATIC;
  this.entity.collision.on("collisionstart", this.onCollisionStart, this);
  this.triggered = false;
};

Gooddoor.prototype.onCollisionStart = function (hit) {
  if (this.triggered) {
    return;
  }

  if (hit.other.tags.has("player")) {
    this.entity.rigidbody.type = pc.BODYTYPE_DYNAMIC;
    var impulse = new pc.Vec3(0, 0, -5000);
    this.entity.rigidbody.applyImpulse(impulse);
    hit.other.collisionTags.push("p1_right");
    this.triggered = true;
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
