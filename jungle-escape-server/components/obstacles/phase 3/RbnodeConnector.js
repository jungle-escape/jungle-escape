var RbnodeConnector = pc.createScript('rbnodeConnector');

RbnodeConnector.attributes.add("speed", { type: "number" });
RbnodeConnector.attributes.add("height", { type: "number" });
RbnodeConnector.attributes.add('connNode1', {
    type: 'entity',
    title: 'Target1',
    description: 'The target node column, which is supposed to rise or fall per its validity.'
});

RbnodeConnector.attributes.add('connNode2', {
    type: 'entity',
    title: 'Target2',
    description: 'The target node column, which is supposed to rise or fall per its validity.'
});

RbnodeConnector.prototype.initialize = function() {
    this.column1 = this.connNode1 ? this.connNode1 : undefined;
    this.column2 = this.connNode2 ? this.connNode2 : undefined;
    if (this.column1) this.column1.originalPosition = this.column1.getLocalPosition().clone();
    if (this.column2) this.column2.originalPosition = this.column2.getLocalPosition().clone();
    
    this.speed = this.speed || 1.0;
    this.height = this.height || 3;

    this.entity.collision.on('collisionstart', this.onCollisionStart, this);
    this.entity.collision.on('collisionend', this.onCollisionEnd, this);
};

RbnodeConnector.prototype.onCollisionStart = function (hit) {
    if (!hit.other?.tags.has("player")) return;

    this.columnTween(this.column1, this.height);
    this.columnTween(this.column2, this.height);
};

RbnodeConnector.prototype.onCollisionEnd = function (hit) {
    if (!hit.other?.tags.has("player")) return;
    
    this.columnTween(this.column1, -this.height);
    this.columnTween(this.column2, -this.height);
};

RbnodeConnector.prototype.columnTween = function (entity, height) {
    if (!entity) return;

    this.tween = entity.tween(entity.getLocalPosition())
        .to(new pc.Vec3(entity.originalPosition.x, height, entity.originalPosition.z), this.speed, pc.Linear)
        .start();
}
