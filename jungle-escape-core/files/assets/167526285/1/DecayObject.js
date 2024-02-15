// var DecayObject = pc.createScript('decayObject');

// DecayObject.attributes.add('decayTime', {
//     type: 'number',
//     default: 5,
//     title: 'Decay Time',
//     description: 'When collision checked, timer starts when collided. If not, timer starts on creation'
// });
// DecayObject.attributes.add('onCollision', {
//     type: 'boolean',
//     default: true,
//     title: 'On Collision',
//     description: 'Should the object decay on collision'
// });

// DecayObject.prototype.initialize = function () {
//     this.initialMaterial = this.entity.render.material.clone();
//     this.entity.rigidbody.on('collisionstart', this.onCollisionStart, this);
//     this.app.on('_rollingStones:postDestroy', this.postDestroy, this);
// }

// DecayObject.prototype.onCollisionStart = function () {
//     if (this.tween) return;

//     this.fromDiffuse = new pc.Color(1, 1, 1);
//     this.toDiffuse = new pc.Color(0, 0, 0);
//     this.tween = this.entity.tween(this.fromDiffuse)
//         .to(this.toDiffuse, 7, pc.ExponentialOut)
//         .onComplete(() => {
//             this.app.fire('_rollingStones:postDestroy');
//         })
//         .start();
// }

// DecayObject.prototype.postDestroy = function () {
//     const entity = this.entity;
//     if (!entity || !entity.rigidbody) return;
//     console.debug(entity);
//     entity.rigidbody.group = 2;
//     // setTimeout((entity) => {
//     //     entity?.destroy();
//     // }, 2000);
// }