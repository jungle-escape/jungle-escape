var MovementPropellerStart = pc.createScript("movementPropellerStart");
MovementPropellerStart.attributes.add("speed", {
  type: "number",
  enum: [
    { slower: 30 },
    { slow: 50 },
    { standard: 100 },
    { fast: 150 },
    { superfast: 200 },
    { insane: 300 },
    { unstoppable: 600 },
  ],
  default: 100,
});
MovementPropellerStart.attributes.add("rotation", {
  type: "number",
  enum: [{ clockwise: -1 }, { "anti-clockwize": 1 }],
  default: -1,
});

MovementPropellerStart.prototype.initialize = function () {
  this.stop = false;
};

MovementPropellerStart.prototype.update = function (dt) {
  if (this.stop) {
    return;
  }

  this.entity.rotate(0, 0, dt * this.speed * this.rotation);
};
