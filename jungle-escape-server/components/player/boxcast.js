var BoxCast = pc.createScript("boxCast");

// initialize code called once per entity
BoxCast.prototype.initialize = function () {
  this.entity.collision.on("triggerenter", this.onTriggerEnter, this);
  this.disableTimer = 0;
  this.pcPos = new pc.Vec3(0, 0, 0);
  this.playerController = this.entity.parent.script.playerController;
  this.lookAt = this.playerController.lookAt;
  this.pushed = [];
};

BoxCast.prototype.onTriggerEnter = function (target) {
  if (
    target !== this.entity.parent &&
    !this.pushed.includes(target) &&
    target.rigidbody
  ) {
    this.lookAt = this.playerController.lookAt;
    var pushForce = 10000;
    var pushVec = this.lookAt?.scale(pushForce);
    target.rigidbody.applyImpulse(pushVec);
    this.pushed.push(target);
    if (target.tags.has("player")) {
      target.signalToClient.push("hit_receive");
    }
    this.entity.parent.signalToClient.push("hit_success");
  }
};

// update code called every frame
BoxCast.prototype.update = function (dt) {
  this.disableTimer += dt;

  this.pcPos = this.entity.parent.getPosition();

  this.lookAt = this.playerController.lookAt;
  if (this.lookAt) {
    var boxPos = this.pcPos.clone().add(this.lookAt?.clone());
    this.entity.setPosition(boxPos);
  }

  if (this.disableTimer >= 0.3) {
    this.entity.enabled = false;
    this.disableTimer = 0;
    this.pushed = [];
  }
};
