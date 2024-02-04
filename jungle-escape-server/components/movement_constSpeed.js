// /** Codes for Entity which has tag 'movingPanel' */

// succ, but polishing is needed
var MovementConstSpeed = pc.createScript("movementConstSpeed");

// Add attributes for speed and range
MovementConstSpeed.attributes.add("speed", {
  type: "number",
  default: 0,
  title: "Speed",
});
MovementConstSpeed.attributes.add("xRange", {
  type: "number",
  default: 0,
  title: "X Range",
});
MovementConstSpeed.attributes.add("yRange", {
  type: "number",
  default: 0,
  title: "Y Range",
});
MovementConstSpeed.attributes.add("zRange", {
  type: "number",
  default: 0,
  title: "Z Range",
});
MovementConstSpeed.attributes.add("movingDirection", {
  type: "boolean",
  default: true,
  title: "Moving Direction",
});

// Initialize
MovementConstSpeed.prototype.initialize = function () {
  this.originPos = this.entity.getPosition().clone();
  this.movementTime = 0;
  this.direction = this.movingDirection ? 1 : -1;
};

MovementConstSpeed.prototype.swap = function (old) {
  this.originPos = old.originPos;
  this.movementTime = old.movementTime;
  this.direction = old.direction;
};

// Update
MovementConstSpeed.prototype.update = function (dt) {
  this.movementTime += dt;

  // Calculate normalized value based on sine wave within the range
  var normalized = Math.sin(this.movementTime * this.speed * this.direction);

  // Calculate new position within the range
  var newPos = new pc.Vec3(
    this.originPos.x + this.xRange * normalized,
    this.originPos.y + this.yRange * normalized,
    this.originPos.z + this.zRange * normalized
  );

  // Update the entity's position
  this.entity.setPosition(newPos);
  this.entity.rigidbody.teleport(newPos);
};
