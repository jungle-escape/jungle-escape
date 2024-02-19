var FloorAttack = pc.createScript("floorAttack");
/** server script for attack  */
FloorAttack.attributes.add("speed", { type: "number" });
FloorAttack.attributes.add("isTriggered", { type: "boolean", default: false });
FloorAttack.attributes.add("targetCell", {
  type: "entity",
  title: "target Entity",
  description: "The attacker block will be attack here",
});

FloorAttack.prototype.initialize = function () {
  // keep original position for returning
  this.originPos = this.entity.getPosition().clone();

  this.blockPos = this.targetCell.getPosition().clone();

  this.attackStartPos = this.blockPos.clone();
  this.attackStartPos.x -= 100;

  // Set target point Position
  this.targetPos = this.blockPos.clone();
  this.targetPos.x += 70;

  // setting for controller
  this.isMovedToStartPos = false;
  this.isMoveEnd = false;
  this.isReturn = false;

  this.isRunning = false;
};

FloorAttack.prototype.swap = function (old) {
  this.speed = old.speed;
  this.isTriggered = old.isTriggered;
  this.targetCell = old.targetCell;

  this.originPos = old.originPos;

  this.blockPos = old.blockPos;

  this.attackStartPos = old.attackStartPos;
  this.targetPos = old.targetPos;

  this.isMovedToStartPos = old.isMovedToStartPos;
  this.isMoveEnd = old.isMoveEnd;
  this.isReturn = old.isReturn;

  this.isRunning = old.isRunning;
};

FloorAttack.prototype.update = function (dt) {
  if (this.isReturn && this.isRunning) {
    // finished action, by unlock isRunning.
    this.isTriggered = false;
    this.isMoveEnd = false;
    this.isReturn = false;
    this.isRunning = false;
    this.isMovedToStartPos = false;

    return;
  }

  if (this.isMoveEnd) {
    //If attacking movement is finished, reset it's position
    this.entity.rigidbody.teleport(this.originPos);
    //  this.entity.setPosition(this.originLocalPos);
    this.isReturn = true; //check it is returned.

    return;
  }

  if (this.isTriggered && !this.isMovedToStartPos) {
    // move block to right position for acttack.
    // lock the state as 'running' prevent other trigger from other user.
    this.isRunning = true;
    this.entity.setPosition(this.attackStartPos);
    this.isMovedToStartPos = true;

    return;
  }

  if (this.isTriggered && this.isMovedToStartPos && this.isRunning) {
    // If it is triggered, set for attack, and in running state...
    var currentPosition = this.entity.getPosition();
    var targetPosition = this.targetPos;

    // Calculate the distance only in the x-axis
    var distanceX = targetPosition.x - currentPosition.x;

    if targetPosition.x >= currentPosition.x) {
      // Use Math.abs for absolute value
      var speedMultiplier = 10;

      // Calculate direction only for the x-axis
      var directionX = distanceX > 0 ? 1 : 0; // Determine the direction on the x-axis

      // Scale movement by speed, dt, and direction on the x-axis
      var moveDistanceX = directionX * this.speed * dt * speedMultiplier;

      // Create a new position vector with the updated x value
      // Keep y and z positions the same as the current position
      var newPosition = new pc.Vec3(
        currentPosition.x + moveDistanceX,
        this.originPos.y,
        currentPosition.z
      );
      this.entity.setPosition(newPosition);
    } else {
      // If the distance is short enough, finish the movement.
      this.isMoveEnd = true;
    }
  }
};

// FloorAttack.prototype.onCollisionStart = function (hit) {
//   if (hit.other.tags.has("player")) {
//     console.log("hit!");
//     var otherEntity = hit.other;
//     var forceDirection = new pc.Vec3(10, 10, 10);
//     forceDirection.normalize();
//     var forceMagnitude = 10000000;
//     var force = forceDirection.scale(forceMagnitude);
//     if (otherEntity.rigidbody) {
//       otherEntity.rigidbody.applyForce(force.x, force.y, force.z);
//     }
//   }
// };
