var FloorButton = pc.createScript('floorButton');

FloorButton.attributes.add('triggerEntity', { type: 'entity' });
FloorButton.attributes.add('connectedEntity', { type: 'entity', description: 'Entity on which event will be triggered' });
FloorButton.attributes.add('positionYCurve', { type: 'curve' });
FloorButton.attributes.add('tags', { type: 'string', array: true, description: 'Only entities with this tags can trigger' });

FloorButton.prototype.initialize = function () {
    this.entity.collision.on("collisionstart", this.onCollisionStart, this);
}

FloorButton.prototype.onCollisionStart = function (hit) {
    if (hit.other.tags.has('player')) {
        // turn off light
        const lampLight = this.entity.findByName('LampLight');
        if (lampLight) {
            lampLight.enabled = false;
        }
        // play turn off sound
        if (!this.entity.sound.slot('turnoff').isPlaying) {
            this.entity.sound.play('turnoff');
        }
        // // Disable entity
        // this.entity.enabled = false;
    }
}