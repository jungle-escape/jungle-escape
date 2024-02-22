var BoxCast = pc.createScript("boxCast");

// // initialize code called once per entity
// BoxCast.prototype.initialize = function () {
//   this.entity.collision.on("triggerenter", this.onTriggerEnter, this);
//   this.disableTimer = 0;
// };

// BoxCast.prototype.onTriggerEnter = function (target) {
//   console.log(target?.name);
// };

// // update code called every frame
// BoxCast.prototype.update = function (dt) {
//   this.disableTimer += dt;
//   if (this.disableTimer >= 0.1) {
//     this.entity.enabled = false;
//   }
// };

// // swap method called for script hot-reloading
// // inherit your script state here
// // BoxCast.prototype.swap = function(old) { };

// // to learn more about script anatomy, please read:
// // https://developer.playcanvas.com/en/user-manual/scripting/
