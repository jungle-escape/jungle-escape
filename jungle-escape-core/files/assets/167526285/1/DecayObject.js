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
    this.app.decayObject = this;
}
