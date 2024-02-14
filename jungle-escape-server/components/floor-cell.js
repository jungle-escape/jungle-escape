var FloorCell = pc.createScript("floorCell");

FloorCell.attributes.add('triggerEntity', { type: 'entity' });
FloorCell.attributes.add("tags", { type: "string", array: true });
FloorCell.attributes.add("color", { type: "rgb" });
FloorCell.attributes.add("isTextShow", { type: "boolean", default: false });
FloorCell.attributes.add("isRightBox", { type: "boolean", default: false });

FloorCell.attributes.add("attacker", {
  type: "entity",
  title: "Attacker Entity",
  description: "The attacker block will be set",
});

FloorCell.prototype.initialize = function () {
  this.activations = 0;

  this.triggerEntity.collision.on("triggerenter", this.onTriggerEnter, this);
  this.triggerEntity.collision.on("triggerleave", this.onTriggerLeave, this);

  //   if (this.attacker) {
  //     console.log(
  //       "this.Attacker",
  //       Object.keys(this.attacker),
  //       typeof this.attacker
  //     );
  //   }
};

FloorCell.prototype.swap = function (old) {
  this.activations = old.activations;
  this.triggerEntity.collision.off("triggerenter", old.onTriggerEnter, old);
  this.triggerEntity.collision.off("triggerleave", old.onTriggerLeave, old);
  this.triggerEntity.collision.on("triggerenter", this.onTriggerEnter, this);
  this.triggerEntity.collision.on("triggerleave", this.onTriggerLeave, this);
};

FloorCell.prototype.onTriggerEnter = function (entity) {
  if (!entity || !this.hasTag(entity.tags)) return;

  this.activations++;
  this.onActivationsChanged();
  // this.activations++;
  // this.onActivationsChanged();
};

FloorCell.prototype.onTriggerLeave = function (entity) {
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

  return false;
};

FloorCell.prototype.activateAttacker = function () {
  if (!this.isRightBox) {
    //this.entity.children[1].script.floorAttack.__attributes.isTriggered = true;

    this.attacker.script.floorAttack.__attributes.isTriggered = true;
  }
};
