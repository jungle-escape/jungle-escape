var RbtreeFalling = pc.createScript('rbtreeFalling');

// initialize code called once per entity
RbtreeFalling.prototype.initialize = function () {

    this.networkEntity = this.entity.script.networkEntity;
    if (!this.networkEntity.mine) return;

    this.entity.collision.on('collisionstart', this.onCollisionStart, this);

};

RbtreeFalling.prototype.onCollisionStart = function (hit) {
    if (this.entity.tags.has('wrongNode')) {
        this.entity.rigidbody.type = pc.BODYTYPE_DYNAMIC;
        this.sendFallingSignal();
    }
}

// Send transform data to server
RbtreeFalling.prototype.sendFallingSignal = function () {

    this.app.fire('rbtreeMsg', 'No Double Red Nodes');
    if (!this.networkEntity) return;

    const bodyType = this.entity.rigidbody.type;

    this.networkEntity.send('falling', {
        bodyType: bodyType
    });
}
