var GameRbtree = pc.createScript('gameRbtree');

// initialize code called once per entity
GameRbtree.prototype.initialize = function () {
    this.networkEntity = this.entity.script.networkEntity;
    this.entity.collision.on('collisionstart', this.onCollisionStart, this);


};

GameRbtree.prototype.onCollisionStart = function (hit) {
    if (hit.other.tags.has('player')) {
        this.entity.rigidbody.type = pc.BODYTYPE_DYNAMIC;
        this.sendFallingSignal();
    }

}

GameRbtree.prototype.sendFallingSignal = function () {

    //  console.log("gbtree", this.app)

    //this.app.fire('obeyRBtreeRules', "No double Reds");
    if (!this.networkEntity) return;
    const bodyType = this.entity.rigidbody.type;
    this.networkEntity.send('falling', {
        bodyType: bodyType
    });
}
