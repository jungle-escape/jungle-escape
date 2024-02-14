// var MovementPanel = pc.createScript('movementPanel');

// // initialize code called once per entity
// MovementPanel.prototype.initialize = function() {
//  this.velocity = new pc.Vec3();
//     this.step = 0;
// };


// MovementPanel.v3 = new pc.Vec3();
// // update code called every frame
// MovementPanel.prototype.update = function(dt) {

// };

// // swap method called for script hot-reloading
// // inherit your script state here
// // MovementPanel.prototype.swap = function(old) { };

// // to learn more about script anatomy, please read:
// // https://developer.playcanvas.com/en/user-manual/scripting/



// MovementPanel.prototype.getVelocity = function(dt) {
//     var currentPosition = this.entity.getPosition();    
//     var velocity = Platform.v3;
//     if (!this.lastPosition) {
//         this.lastPosition = new pc.Vec3().copy(currentPosition);
//     } else {
//         velocity.copy(currentPosition).sub(this.lastPosition).scale(1/dt);
//         this.lastPosition.copy(currentPosition);
//     }
//     return velocity;
// };

// MovementPanel.prototype.postUpdate = function(dt) {

//     this.step += dt * 4;
//     this.entity.translate(Math.cos(this.step) * 0.3, 0, 0);
//     var velocity = this.getVelocity(dt);    
//     this.app.fire('update-velocity', velocity);
// };
