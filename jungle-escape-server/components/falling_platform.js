var FallingPlatform = pc.createScript("fallingPlatform");

FallingPlatform.prototype.initialize = function () {
  this.entity.networkEntity.on("falling", this.setFalling, this);
};

FallingPlatform.prototype.swap = function (old) {};

FallingPlatform.prototype.setFalling = function (sender, data) {
  this.entity.bodyType = data.bodyType;
};
