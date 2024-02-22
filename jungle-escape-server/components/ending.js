var Ending = pc.createScript('ending');

Ending.prototype.initialize = function() {
    this.entity.collision.on("collisionstart", this.onCollisionStart, this);
};


Ending.prototype.onCollisionStart = function(hit) {
    if (hit.other.tags.has("player")) {
        this.entity.networkEntity.send("ending");
    };
};
