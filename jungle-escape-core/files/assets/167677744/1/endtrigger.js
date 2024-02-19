var Endtrigger = pc.createScript('endtrigger');

// initialize code called once per entity
Endtrigger.prototype.initialize = function() {
    this.entity.collision.on('collisionstart', this.onCollisionStart,this);
};

Endtrigger.prototype.onCollisionStart = function (hit) {
    if (hit.other.tags.has('player')) {
        console.log("hi you are player!");
    }
}