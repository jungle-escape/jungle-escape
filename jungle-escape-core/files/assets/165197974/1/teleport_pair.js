var TeleportPair = pc.createScript('teleportPair');
TeleportPair.attributes.add('target', {
    type: 'entity',
    title: 'Target Entity',
    description: 'The target entity where we are going to teleport'
});

// initialize code called once per entity
TeleportPair.prototype.initialize = function () {
    if (this.target) {
        this.entity.collision.on('triggerenter', this.onTriggerEnter, this);
    }

    this.saveInterPols;
    this.tempInterPols

};


// teleport object should be a little gap with the floor.
TeleportPair.prototype.onTriggerEnter = function (otherEntity) {

    if (!otherEntity.tags.has('player'))
        return;

    this.teleport(otherEntity, this.target);

};

TeleportPair.prototype.teleport = function (playerEntity, targetEntity) {

    let dstPos = targetEntity.position //Vec3 ..
    dstPos.z = dstPos.z - 4
    playerEntity.rigidbody.teleport(dstPos)

}
