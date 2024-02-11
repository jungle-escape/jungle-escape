/** Codes for Entity which has tag 'movingPanel' */

var MovementConstSpeed = pc.createScript("movementConstSpeed");

// MovementConstSpeed.attributes.add("speed", {
//     type: "size",
//     title: "speed",
//     description: "the amount of time one has spent moving",
// });

// Add attributes for speed and range
MovementConstSpeed.attributes.add("speed", {
    type: "number",
    default: 0,
    title: "Speed",
});

MovementConstSpeed.attributes.add("xRange", {
    type: "number",
    title: "x Range",
    description: "How far will you move on the x-axis",
});
MovementConstSpeed.attributes.add("yRange", {
    type: "number",
    title: "y Range",
    description: "How far will you move on the x-axis",
});
MovementConstSpeed.attributes.add("zRange", {
    type: "number",
    title: "z Range",
    description: "How far will you move on the z-axis",
});

MovementConstSpeed.attributes.add("movingDirection", {
    type: "boolean",
    title: "moving direction",
    description: "If it is true, direction would be 0 to 1, else -1 to 0.",
});


// MovementConstSpeed.prototype.initialize = function () {
//     this.originPos = this.entity.getPosition().clone(); // Store the original position
//     this.currPos = this.entity.getPosition();
//     this.nomalizedSpeed = 0;

//     //timer for console.log in each 5 sec
//     this.timer = 0;

// };
/** Codes in Server  */
// initialize code called once per entity
// MovementConstSpeed.prototype.initialize = function () {
//     this.originPos = this.entity.getPosition().clone(); // Store the original position
//     this.currPos = this.entity.getPosition();
//     this.nomalizedSpeed = 0;

//     //timer for console.log in each 5 sec
//     this.timer = 0;

// };

// // update code called every frame
// MovementConstSpeed.prototype.update = function (dt) {
//     this.timer += 1;

//     var normalized = this.nomalize(this.speed, this.direction);

//     // Apply movement based on range and normalized values
//     var dx = (this.xRange / 2) * normalized;
//     var dy = (this.yRange / 2) * normalized;
//     var dz = (this.zRange / 2) * normalized;

//     // Update current position
//     this.currPos.set(this.originPos.x + dx, this.originPos.y + dy, this.originPos.z + dz);

//     // Set new position of the platform
//     this.entity.setPosition(this.currPos.x, this.currPos.y, this.currPos.z);

// };

// /** Normalized value functions */
// // 현재 direction 사용하지 않음.

// MovementConstSpeed.prototype.nomalize = function (speed, direction) {
//     var time = (Date.now() / 1000) * speed;
//     var normalized = Math.sin(time); // -1 에서 1 사이의 값


//     if (direction) return normalized;
//     else return -1 * normalized;
// };


