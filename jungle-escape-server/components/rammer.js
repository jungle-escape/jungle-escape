var Rammer = pc.createScript("rammer");

Rammer.attributes.add("positionXCurve", { type: "curve" });

Rammer.prototype.initialize = function () {
  this.defaultPositionX = this.entity.getPosition().x;
  this.vec3 = new pc.Vec3();
  this.time = 0;
  this.direction = 1;
};

Rammer.prototype.swap = function (old) {
  this.defaultPositionX = old.defaultPositionX;
  this.vec3 = old.vec3;
  this.time = old.time;
};

Rammer.prototype.update = function (dt) {
  const directionX = this.entity.name === "Rammer01" ? 1 : -1;
  const speed = this.entity.name === "Rammer01" ? 1 : 1.5;

  this.time += this.direction * dt * speed;

  if (this.time > 1 || this.time < 0) {
    this.direction *= -1;
    this.time = pc.math.clamp(this.time, 0, 1);
  }

  this.vec3.copy(this.entity.getPosition());
  this.vec3.x =
    this.defaultPositionX +
    this.positionXCurve.value(this.time) * 3 * directionX;

  this.entity.rigidbody.teleport(this.vec3);
};
