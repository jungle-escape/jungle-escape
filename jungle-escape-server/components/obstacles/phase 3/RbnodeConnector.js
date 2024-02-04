var RbnodeConnector = pc.createScript('rbnodeConnector');

RbnodeConnector.attributes.add("speed", { type: "number" });
RbnodeConnector.attributes.add("height", { type: "number" });
RbnodeConnector.attributes.add('toBeConnNode1', {
    type: 'entity',
    title: 'Target1',
    description: 'The target node column, which is supposed to rise or fall per its validity.'
});

RbnodeConnector.attributes.add('toBeConnNode2', {
    type: 'entity',
    title: 'Target2',
    description: 'The target node column, which is supposed to rise or fall per its validity.'
});

class RbnodeEvent {
    constructor(column) {
        this.column = column;
        this.speed = this.speed ? this.speed : 1.0;
        this.height = this.height ? this.height : 3.0;
    }
};

RbnodeConnector.prototype.initialize = function() {
    this.column1 = this.toBeConnNode1;
    this.column2 = this.toBeConnNode2;

    console.debug("RbnodeConnector:initialize");
    this.entity.collision.on('collisionstart', this.onCollisionStart, this);
    this.entity.collision.on('collisionend', this.onCollisionEnd, this);
};

RbnodeConnector.prototype.onCollisionStart = function (hit) {
    // if (!entity || !this.hasTag(entity.tags)) return;
    if (!hit.other?.tags.has("player")) return;

    console.debug("RbnodeConnector:onCollisionStart");
    this.app.fire('rbnode:raiseColumn', new RbnodeEvent(this.column1));
    this.app.fire('rbnode:raiseColumn', new RbnodeEvent(this.column2));
};

RbnodeConnector.prototype.onCollisionEnd = function (hit) {
    // if (!entity || !this.hasTag(entity.tags)) return;
    if (!hit.other?.tags.has("player")) return;
    
    console.debug("RbnodeConnector:onCollisionEnd");
    this.app.fire('rbnode:lowerColumn', new RbnodeEvent(this.column1));
    this.app.fire('rbnode:lowerColumn', new RbnodeEvent(this.column2));
};