// NOTE : Used for playing Phase1 hit effect

var WrongEffect = pc.createScript('wrongEffect');

// initialize code called once per entity
WrongEffect.prototype.initialize = function() {
    // NOTE : emitter muste be 2nd children of entity
    this.emitter = this.entity.children[1];
    this.entity.collision.on('collisionstart', this.onCollisionStart, this);
};

WrongEffect.prototype.onCollisionStart = function (hit) {
    if (hit.other.tags.has('player')) {
        this.emitter.script.effekseerEmitter.play();
    }
}

// update code called every frame
WrongEffect.prototype.update = function(dt) {
};