var FloorCell = pc.createScript("floorCell");
var FloorCell = pc.createScript("floorCell");

FloorCell.attributes.add("tags", { type: "string", array: true });
FloorCell.attributes.add("color", { type: "rgb" });
FloorCell.attributes.add("isTextShow", { type: "boolean", default: false });
FloorCell.attributes.add("isRightBox", { type: "boolean", default: false });

FloorCell.prototype.initialize = function () {
  this.activations = 0;
  this.activations = 0;

  this.entity.collision.on("triggerenter", this.onTriggerEnter, this);
  this.entity.collision.on("triggerleave", this.onTriggerLeave, this);
  this.entity.collision.on("triggerenter", this.onTriggerEnter, this);
  this.entity.collision.on("triggerleave", this.onTriggerLeave, this);
};

FloorCell.prototype.swap = function (old) {
  this.activations = old.activations;
  this.entity.collision.off("triggerenter", old.onTriggerEnter, old);
  this.entity.collision.off("triggerleave", old.onTriggerLeave, old);
  this.entity.collision.on("triggerenter", this.onTriggerEnter, this);
  this.entity.collision.on("triggerleave", this.onTriggerLeave, this);
};

FloorCell.prototype.onTriggerEnter = function (entity) {
  if (!entity || !this.hasTag(entity.tags)) return;
  if (!entity || !this.hasTag(entity.tags)) return;

  this.activations++;
  this.onActivationsChanged();
  this.activations++;
  this.onActivationsChanged();
};

FloorCell.prototype.onTriggerLeave = function (entity) {
  if (!entity || !this.hasTag(entity.tags)) return;
  if (!entity || !this.hasTag(entity.tags)) return;

  if (!this.isRightBox) {
    this.activations--;
    this.onActivationsChanged();
  }
};

FloorCell.prototype.onActivationsChanged = function () {
  if (this.activations > 0) {
    if (this.isRightBox) this.color.set(0, 0.2, 0);
    else {
      // null box activate
      this.color.set(1, 0, 0);
      this.isTextShow = true;
      this.activateAttacker();
    }
  } else {
    this.color.set(0, 0, 0);
  }
};

FloorCell.prototype.hasTag = function (tags) {
  for (let i = 0; i < this.tags.length; i++) {
    if (tags.has(this.tags[i])) return true;
  }
  for (let i = 0; i < this.tags.length; i++) {
    if (tags.has(this.tags[i])) return true;
  }

  return false;
  return false;
};

FloorCell.prototype.activateAttacker = function () {
  if (!this.isRightBox) {
    this.entity.children[1].script.floorAttack.__attributes.isTriggered = true;
  }
};
