var GameRbtree = pc.createScript("gameRbtree");

// initialize code called once per entity
GameRbtree.prototype.initialize = function () {
  this.entity.networkEntity.on("falling", this.setFalling, this);
};

GameRbtree.prototype.swap = function (old) {};

// falling code
GameRbtree.prototype.setFalling = function (sender, data) {
  const originBodyType = this.entity.bodyType;
  this.entity.bodyType = data.bodyType;
};
