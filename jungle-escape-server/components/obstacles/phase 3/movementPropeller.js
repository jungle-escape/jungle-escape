var MovementPropeller = pc.createScript("movementPropeller");
MovementPropeller.attributes.add('speed', {
  type: 'number',
  enum: [
    { 'slow': 50 },
    { 'standard': 100 },
    { 'fast': 150 },
    { 'superfast': 200 },
    { 'insane': 300 },
  ],
  default: 100
});
MovementPropeller.attributes.add('rotation', {
  type: 'number',
  enum: [
    { 'clockwise': -1 },
    { 'anti-clockwize': 1 }
  ],
  default: -1
});

MovementPropeller.prototype.update = function (dt) {
  this.entity.rotate(0, dt * this.speed * this.rotation, 0);
};