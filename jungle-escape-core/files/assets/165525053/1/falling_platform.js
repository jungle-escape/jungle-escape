var FallingPlatform = pc.createScript('fallingPlatform');

// initialize code called once per entity
FallingPlatform.prototype.initialize = function() {
    this.networkEntity = this.entity.script.networkEntity;

    if (!this.networkEntity.mine) return;
};