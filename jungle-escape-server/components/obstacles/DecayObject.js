var DecayObject = pc.createScript('decayObject');

DecayObject.attributes.add('decayTime', {
    type: 'number',
    default: 5,
    title: 'Decay Time',
    description: 'When collision checked, timer starts when collided. If not, timer starts on creation'
});
DecayObject.attributes.add('onCollision', {
    type: 'boolean',
    default: true,
    title: 'On Collision',
    description: 'Should the object decay on collision'
});

DecayObject.prototype.initialize = function () {
    this.entity.render.material = this.entity.render.material.clone();
    this.entity.render.material.update();

    const generate = setTimeout(() => {
        console.debug('DecayObject generated');
        this.onCollisionStart();
    }, 2000);
    this.entity.once('destroy', () => {
        console.debug('DecayObject destroyed');
        clearTimeout(generate);
    });
    this.entity.rigidbody.on('collisionstart', generate, this);
}

DecayObject.prototype.onCollisionStart = function () {
    this.entity.rigidbody.off('collisionstart');
    
    this.fromDiffuse = new pc.Color(1, 1, 1);
    this.toDiffuse = new pc.Color(0, 0, 0);
    console.debug('DecayObject decay started');
    this.entity.tween(this.fromDiffuse)
        .to(this.toDiffuse, 5, pc.ExponentialOut)
        .onUpdate(() => {
            this.entity.render.material.diffuse = this.fromDiffuse;
            this.entity.render.material.update();
        })
        .onComplete(() => {
            this.entity.tags.clear();
            this.entity.rigidbody.group = 2;
        })
        .start();
}